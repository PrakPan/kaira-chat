#!/bin/bash

# Enable printing executed commands
set -x

# Exit immediately if a command exits with a non-zero status.
set -e

trap "exit" INT

deploy_env=""
trips=false

positional_args=()

print_usage() {
  echo "Usage: $0 <deploy_env> [options]"
  echo "deploy_env > dev, prod, yourtrips"
  echo "options > -trips"
}

while [[ $# -gt 0 ]]; do
  case $1 in
    -trips)
    trips=true
    shift ;;
    *)
    positional_args+=("$1")
    shift ;;
  esac
done

# Check if positional argument 'deploy_env' is set
if [[ ${#positional_args[@]} -gt 0 ]]; then
  deploy_env=${positional_args[0]}
fi


if [ -z "$deploy_env" ]; then
    echo "Please provide deployment environment"
    print_usage
    exit 1
elif [ "$deploy_env" != "dev" ] && [ "$deploy_env" != "prod" ] && [ "$deploy_env" != "yourtrips" ]; then
    echo "Invalid deployment environment"
    print_usage
    exit 1
fi

# Get S3 Bucket and CloudFront Id from environment variables
if [ "$deploy_env" == 'dev' ]; then
  s3_bucket="nextjs-dev-2"
  cf_id="E3T22L50EDEN1W"
  cp .env.development .env.local
elif [ "$deploy_env" == 'prod' ]; then
  s3_bucket="ttw-nextjs"
  cf_id="EW37HZUU6T8S9"
  cp .env.production .env.local
else
  s3_bucket="yourtrips-nextjs"
  cf_id="E28HVCR7LF1VH2"
  cp .env.production .env.local
fi

echo S3_Bucket: $s3_bucket
echo CloudFront_Distribution: $cf_id

if [ -z "$s3_bucket" ]; then
  echo S3_BUCKET not found
  exit
fi

if [ -z "$cf_id" ]; then
  echo CF_ID not found
  exit
fi

# Create build
if ! $trips; then
    node scripts/removeTripsPage.js prebuild || exit
fi

npm run build || exit

if ! $trips; then
    node scripts/removeTripsPage.js postbuild || exit
fi

# Add build number to env file
if [ "$deploy_env" == 'dev' ]; then
  echo "NEXT_PUBLIC_SENTRY_RELEASE=$BUILD_NUMBER" >> .env.development
else
  echo "NEXT_PUBLIC_SENTRY_RELEASE=$BUILD_NUMBER" >> .env.production
fi

# Check if build folder is present
if [ ! -d "out" ]; then
    echo "Build folder not found"
    exit 1
fi

# Create index file for every path
python3 index_path.py || exit

# Upload build folder to S3
echo Synching Build Folder: $s3_bucket...
if $trips; then
    aws s3 sync out/ s3://$s3_bucket --delete --cache-control max-age=31536000,public
else
    aws s3 sync out/ s3://$s3_bucket --cache-control max-age=31536000,public
fi

# Create cache invalidation on cloudfront distribution
if [ ! -z "$cf_id" ]; then
    echo Invalidating cloudfront cache
    aws cloudfront create-invalidation --distribution-id $cf_id --paths "/*"
fi

echo "Deployment completed successfully!"
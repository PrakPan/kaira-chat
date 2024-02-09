# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### AWS Amplify Configuration ###
##### Add Environment variables in App Settings > Environment variables  #####

* NEXT_PUBLIC_CONTENT_SERVER_HOST = "https://apis.tarzanway.com"
* NEXT_PUBLIC_MIS_SERVER_HOST = "https://suppliers.tarzanway.com"
* NEXT_PUBLIC_GOOGLE_CLIENT_ID = ""
* NEXT_PUBLIC_GOOGLE_ANALTICS_ID = ""
* NEXT_PUBLIC_FACEBOOK_PIXEL_ID = ""
* NEXT_PUBLIC_HOTJAR_HJID = ""
* NEXT_PUBLIC_HOTJAR_HJSV = ""

### Development Server Configuration ###
##### Add Environment variables in ~/.bashrc  #####

* export NEXT_PUBLIC_CONTENT_SERVER_HOST = "https://dev.apis.tarzanway.com"
* export NEXT_PUBLIC_MIS_SERVER_HOST = "https://dev.suppliers.tarzanway.com"
* export NEXT_PUBLIC_GOOGLE_CLIENT_ID = ""
* export NEXT_PUBLIC_GOOGLE_ANALTICS_ID = ""
* export NEXT_PUBLIC_FACEBOOK_PIXEL_ID = ""
* export NEXT_PUBLIC_HOTJAR_HJID = ""
* export NEXT_PUBLIC_HOTJAR_HJSV = ""

##### After adding these environment variables to ~/.bashrc run the below command to load these environment variables in current session #####

* source ~/.bashrc


### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

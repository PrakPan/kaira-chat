export const latlongfeatcher({cityName}){
 const { data, loading, error } = useFetch(`https://apis.tarzanway.com/poi/city/?slug=${slug}&fields=lat,long`);
 if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
return 

}   
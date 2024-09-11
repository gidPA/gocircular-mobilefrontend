export const convertTZ = (date:string, tzString:string): string => {
    const converted = new Date((typeof date === "string" ? new Date(date) : date))
    return converted.toLocaleString("en-GB", {
        timeZone: tzString,
    });

}
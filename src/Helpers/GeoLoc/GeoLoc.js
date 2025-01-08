import { Geolocation } from "@capacitor/geolocation";
export var lastLocationWatch = null;
export var geolocationError = null;
export var geolocationPermissionError = null;

export var watchId = null;
export const getDeviceLocation = async (maxAge = 30, watchTime = 0) => {
    let coordinates = null;

    if (maxAge && lastLocationWatch  &&
        (maxAge * 1000) >  (Date.now() - lastLocationWatch.timestamp))
    {
        console.log('Max Age not expired, returning lastLocationWatch',lastLocationWatch);
        return lastLocationWatch;
    }

    const options = {
        enableHighAccuracy: true,
        maximumAge: maxAge * 1000,
        timeout: 15 * 1000,
        minimumUpdateInterval: watchTime ? watchTime * 1000 : maxAge * 1000
    };        

    try {   
        coordinates = await Geolocation.getCurrentPosition(options);
        console.log('Coordinates: ', coordinates);   
        if (watchTime > 0) {
            lastLocationWatch = coordinates ;
            watchId = await Geolocation.watchPosition(options, getDeviceLocation );
        }
        else if (watchTime === 0 && watchId) {
            await Geolocation.clearWatch(watchId); 
            watchId = 0;
        }
        lastLocationWatch = coordinates ;
        return lastLocationWatch;
    } catch (error) {
        console.log(error);
        const permState = await getPermissions();
        if (permState && permState.location !== 'denied' && !geolocationError && !geolocationPermissionError) {
            geolocationError = error;
            return await getDeviceLocation(maxAge, watchTime);
        }
        else {
            await getCoordsFromBrowser();
            return lastLocationWatch;
        }
    }
};

const getPermissions = async () => {
    try {
        const permState = await Geolocation.requestPermissions();
        console.log('Permissions: ', permState);
        return permState;
    } catch (error) {
        console.log('no location service or else...', error);
        geolocationPermissionError = error;
        return null;
    }
};
    
const getCoordsFromBrowser = async () => {
    try {
        const coord = await getCoordsFromNavigator()
        coord.coords['lat'] = coord.coords.latitude;
        coord.coords['lng'] = coord.coords.longitude;
        
        console.log('location from navigator ', coord);
        lastLocationWatch = coord;
        return true;
    }
    catch (err) {
        console.log('failed to get coords from navigator...', err)
        return false;
    }
}


const getCoordsFromNavigator = () => new Promise(
            (resolve, reject) => window.navigator.geolocation.getCurrentPosition(
                position => {
                    console.log('Position: ', position);
                    resolve(position);
                },  
                error => {
                    console.log('Error: ', error);
                    reject(null);
                }
            )
        );

     
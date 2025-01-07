import { Geolocation } from "@capacitor/geolocation";
export var lastLocationWatch = null;
export var watchId = null;
export const getDeviceLocation = async (maxAge = 5, watchTime = 0) => {
    let coordinates = null;

    if (maxAge && lastLocationWatch  &&
        (maxAge * 1000) >  (Date.now() - lastLocationWatch.timestamp))
    {
        return lastLocationWatch;
    }

    const options = {
        enableHighAccuracy: true,
        maximumAge: maxAge * 1000,
        timeout: watchTime * 3000,
        minimumUpdateInterval: watchTime * 1000
    };        

    try {   
        coordinates = await Geolocation.getCurrentPosition(options);
    } catch (error) {
        console.log(error);
        const permState = await getPermissions();
        if (!permState || permState.location === 'denied') {
            coordinates = null;
        }
        else {
            coordinates = await Geolocation.getLocation(options);
        }
    }  finally {
        console.log('Coordinates: ', coordinates);   
    }

    if (watchTime > 0) {
        lastLocationWatch = coordinates;
        watchId = await Geolocation.watchPosition(options, 
                (position, error) => { 
                    if (error) {
                        console.log(error);
                        return;
                    }
                    return position;
                }
            );
    }
    
    else if (watchId) {
        await Geolocation.clearWatch(watchId); 
        watchId = 0;
    }
    return coordinates;
};

const getPermissions = async () => {
    try {
        const permState = await Geolocation.requestPermissions();
        console.log('Permissions: ', permState);
        return permState;
    } catch (error) {
        console.log('no location service or else...',error);
        return null;
    }
}

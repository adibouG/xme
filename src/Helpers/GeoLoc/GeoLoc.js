import { Geolocation } from "@capacitor/geolocation";
export let lastLocationWatch = null;
export let watchId = 0;
export const getDeviceLocation = async (maxAge = 5, watchTime = 0) => {
    let coordinates = null;

    if (maxAge && lastLocationWatch  &&
        (maxAge * 1000) >  (Date.now() - lastLocationWatch.timestamp))
    {
        return lastLocationWatch;
    }

    try {   
        coordinates = await Geolocation.getCurrentPosition();
    } catch (error) {
        console.log(error);
        const permState = await getPermissions();
        if (!permState || permState.location === 'denied') {
            coordinates = null;
        }
        else {
            coordinates = await Geolocation.getLocation();
        }
    }  finally {
        console.log('Coordinates: ', coordinates);   
    }

    if (watchTime > 0) {
        lastLocationWatch = coordinates;
        watchId = window.setInterval(
            getDeviceLocation,
            watchTime * 1000,
            maxAge, watchTime
        )
    }
    else if (watchId) {
        window.clearInterval(watchId);
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

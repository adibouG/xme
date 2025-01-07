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
        if (coordinates === null &&
             (!permState || permState.location === 'denied'))
        {
            return;
        }
        else if (permState && permState.location !== 'denied') {
            coordinates = await Geolocation.getLocation(options);
        }
    }  finally {
        console.log('Coordinates: ', coordinates);   
    }

    lastLocationWatch = coordinates || lastLocationWatch;
    if (watchTime > 0) {
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
        console.log('no location service or else...', error);
        const coord = await getCoordsFromNavigator()
        if (coord) {
            console.log('location from navigator ', coord);
            coordinates = coord;
            return;
        }
        else {
            console.log('failed to get coords from navigator...', err)
            return;
        }
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

     
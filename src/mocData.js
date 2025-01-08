export const mocData = {
    "users": [
    {
        "id": 1,
        "username": "joe",
        "preference": {
            "channels" : [],
        },
        "location": {
            timestamp: 123456789,
            coords: {
                lat: 23,
                lng: 45
            }
        }
    },
    {
        "id": 2,
        
        "username": "joe",
        "preference": {
            "channels" : [],
        },
        "location": {
            timestamp: 123456789,
            coords: {
                lat: 22,
                lng: 56
            }
        }
    },
    {
        "id": 3,
        "username": "joe",
        "preference": {
            "channels" : [1],
        },
        "location": {
            timestamp: 123456789,
            coords: {
                lat: 11,
                lng: 46
            }
        }
    },
    {
        "id": 4,
        "username": "joe",
        "preference": {
            "channels" : [2, 3],
        },
        "location": {
            timestamp: 123456789,
            coords: {
                lat: 12,
                lng: 45
            }
        }
    }],
    "channels": [
        {
            "id": 1,
            "name": "channel1"
        },
        {
            "id": 2,
            "name": "channel2"
        },
        {
            "id": 3,
            "name": "channel3"
        },
        {
            "id": 4,
            "name": "channel4"
        }
    ]
}
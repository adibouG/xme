export const mocData = {
    "users": [
    {
        "id": 1,
        "username": "joe",
        "preference": {
            "channels" : [],
            "categories": []
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
            "categories" : [],
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
            "categories" : [1],
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
            "categories" : [2, 3],
        },
        "desc": "",
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
            "name": "fun, casual and friedly",
            
        },
        {
            "id": 2,
            "name": "open to dating"
        },
        {
            "id": 3,
            "name": "looking for x-men..."
        },
        {
            "id": 4,
            "name": "looking for x-women..."
        }
    ],
    "categories": [
        {
            "id": 1,
            "name": "men",
        },
        {
            "id": 2,
            "name": "women"
        },
        {
            "id": 3,
            "name": "hetero"
        },
        {
            "id": 4,
            "name": "homo"
        },
        {
            "id": 5,
            "name": "bisexual"
        },
        {
            "id": 6,
            "name": "transgender"
        },  
        {
            "id": 7,
            "name": "other"
        },  
        {
            "id": 8,
            "name": "keywords"
        }
    ]
}
import {Device} from '@capacitor/device';

export const getDeviceType = async () => {
    const info = await Device.getInfo();
    console.log('Device info: ', info.platform);
    return info.platform;
}

// ios security dict key NSPrivacyAccessedAPICategoryDiskSpace
// reason 85F4.1 
// - in PrivacyInfo.xcprivacy  
/*
ex:
<?xml version="1.0" encoding="UTF-8"?>
<DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIKey</key>
            <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>85F4.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
*/
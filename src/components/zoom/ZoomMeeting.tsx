import { useEffect } from "react";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import { getZoomMeetingSignature } from "../../service/ApiZoom";

const ZoomMeeting = () => {
    useEffect(() => {
        const startMeeting = async () => {
            try {
                // const meetingNumber = "YOUR_MEETING_ID";
                // const password = "YOUR_PASSCODE";

                const data = await getZoomMeetingSignature(0);

                const client = ZoomMtgEmbedded.createClient();

                const meetingSDKElement = document.getElementById(
                    "meetingSDKElement"
                ) as HTMLElement;

                await client.init({
                    zoomAppRoot: meetingSDKElement,
                    language: "en-US",
                    patchJsMedia: true,
                });

                await client.join({
                    sdkKey: "H_e5qgo0Q_Pnz3Yt5pMUQ",
                    signature: data.signature,
                    meetingNumber: data.meetingNumber,
                    password: data.meetingPassword,
                    userName: "React User",
                });
            } catch (error) {
                console.error("Error starting Zoom meeting:", error);
            }
        };

        startMeeting();
    }, []);

    return (
        <div
            id="meetingSDKElement"
            style={{ width: "100%", height: "100vh" }}
        ></div>
    );
};

export default ZoomMeeting;
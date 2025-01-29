function startQRScanner(dotNetHelper) {
    const videoElement = document.getElementById('video');
    const canvasElement = document.createElement('canvas');
    const canvasContext = canvasElement.getContext('2d');

    const constraints = {
        video: {
            facingMode: 'environment'
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            videoElement.srcObject = stream;
            videoElement.setAttribute('playsinline', true); // Required to play video inline on iPhone
            videoElement.play();

            const codeReader = new ZXing.BrowserQRCodeReader();
            const scan = () => {
                try {
                    canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                    const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
                    const result = codeReader.decodeFromImageData(imageData);
                    if (result) {
                        dotNetHelper.invokeMethodAsync('OnQRCodeDetected', result.getText());
                        return;
                    }
                } catch (error) {
                    console.error(error);
                }

                requestAnimationFrame(scan);
            };

            scan();
        })
        .catch(function (err) {
            console.error(err);
        });
}

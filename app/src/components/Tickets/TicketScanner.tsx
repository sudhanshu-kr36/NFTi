import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState('No result');
  const droidCamVideoLink = 'http://192.168.20.121:4747/video';
  const videoId = 'myDroidCamVideo'; // Set an ID for the video element

  useEffect(() => {
    // Set the video source to the DroidCam video link
    const videoElement = document.getElementById(videoId) as HTMLVideoElement | null;
    if (videoElement) {
      videoElement.src = droidCamVideoLink;
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("error on droid cam ", error);
        });
      }
    }
  }, []);

  const handleScan = (result: any) => {
    if (result) {
      try {
        const resultText =
          typeof result.getText === 'function' ? result.getText() : (result?.text || '');
        const parsed = JSON.parse(resultText);
        if (parsed) {
          console.log("formatted result ", parsed);
          onScan(parsed._key || resultText);
          setData(resultText);
        }
      } catch (error) {
        console.log("error parsing scanned data ", error);
        // fallback to raw text
        onScan(result.text || null);
        setData(result.text || 'No result');
      }
    }
  };

  const handleError = (err: Error) => {
    setError(err.message);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <QrReader
        scanDelay={1000}
        onResult={(result, error) => {
          if (result) {
            handleScan(result);
          }
          if (error) {
            handleError(error);
          }
        }}
        constraints={{ facingMode: 'user' }}
        
      />
    </div>
  );
};

export default QRCodeScanner;

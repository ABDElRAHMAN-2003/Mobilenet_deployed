import React, { useState, useRef, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

const ImageClassifier = () => {
  const [imageURL, setImageURL] = useState('');
  const [predictions, setPredictions] = useState([]);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imageURL) {
      console.log('Image element and URL are ready, classifying image...');
      classifyImage(imgRef.current);
    }
  }, [imageURL]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      console.log('File read successfully, setting image URL');
      setImageURL(reader.result);
    };

    if (file) {
      console.log('Reading file...');
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected');
    }
  };

  const classifyImage = async (imgElement) => {
    try {
      console.log('Setting TensorFlow backend...');
      await tf.setBackend('webgl');

      console.log('Loading mobilenet model...');
      const model = await mobilenet.load();
      console.log('Model loaded, classifying image...');
      const predictions = await model.classify(imgElement);
      console.log('Classification complete, setting predictions', predictions);
      setPredictions(predictions);
    } catch (error) {
      console.error('Error classifying image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {imageURL && <img ref={imgRef} src={imageURL} alt="Uploaded" style={{ maxWidth: '300px' }} />}
      {predictions.length > 0 && (
        <div>
          <h2>Predictions:</h2>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>{`${prediction.className}: ${Math.floor(prediction.probability * 100)}%`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;

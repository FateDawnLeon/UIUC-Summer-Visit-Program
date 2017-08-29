# UIUC-Summer-Visit-Program

### As you can see, in the program directory, there are two website projects, 'push-notification' and 'video-streaming'. 

## Streaming video from the webcam
---

### The 'video-streaming' website is constructed using Python and Flask. Normally a website is composed of two parts, backend and frontend. In the project's directory, two python files, app.py and camera.py represent the server side. They run in the backend. The other two folders, 'static' and 'templates' contain all the frontend codes, which dicide how the website will look. To modify the appearence of the website, you can make adjustment and in these two folder. At present, the core function has been finished by using OpenCV to control the webcam to open up or shutdown as well as capture images. These functions are wrapped in camera.py. By calling the the function in app.py we can handle the request received from client's browser and send back frames of captured images to show in the web page. To test the website, please refer to README.md in its own directory. To learn more about Python and Flask, refer to https://www.python.org/ and http://flask.pocoo.org/. You may also need to be familiar with OpenCV http://opencv.org/.

## Subscription and pushing notifications
---

### In order to automatically send alarm to the user once a violent event is detected by the IOT board, we need a notification push system. Actually, there are already some mature commercial solutions for message pushing in favor of keeping their old user engaged and atracting new comers. In our project, I chose the Web Push Notification API developed by Google. To finally receive the alarming message from our backend server, we first need to subscrib the notification function. Then a subscription info generated by the javascript code runnning on clients' browser will be sent to the backend. After that, the backend can store the info into its database, and once the alarming push is triggered, the backend can send the message to user by looking up its table of subscription info. For now, I haven't accomplied the function of sending subscription to backend and storing it in database. However, in order to see the core push notification result as soon as possible, I make a 'send push message' button to manually send subscription info, private and public key, and customized message data to backend. The backend will then receive the post request attached with these infos, so it can send a notification push using these data. To learn more details about how this works and how to use the API, I strongly recommend reading the official introduction and user guide. Below is a really simple quick guide for new comers. https://developers.google.com/web/fundamentals/getting-started/codelabs/push-notifications/ 

### Our push-notification website project has a similar file skeleton as the video-streaming one. Inside the 'static' folder are some frontend code files that you can modify. The remaining files and folder are backend written in javascript based on express framework and node.js runtime environment. I recommend you be quite familiar with node.js programming if you still want to develop the project using javascript (honestly, it's kind of confusing and tricky).

### The remaining work of this part is to write code for sending subscription info to backend and storing it into database, and also we need to let backend run a thread to listen to the USB port to detect the triggering signal from IOT board and send notification push message once the event is fired.

## Other recommendation
---

### For now the video streaming fucntion still has some defects. First, it is actually keep capturing raw images and send them to the frontend. It does not utilize any media streaming protocols to compress the data and control the synchronization problem. Though it may work in a limited local network, it will probably fail in a practical environment considering its high cost of bandwidth. So I strongly recommend using WebRTC (https://webrtc.org/) API to develop the video streaming function. It's also developed by Google and has excellent performance when it comes to a need for P2P multimedia live streaming.

### Another problem is that the video streaming backend can now only handle one request at the same time, which means once the video is starting to stream, all other requests from other browsers are blocked. I have been struggling with such problems with concurrency for quite a long time. Hope you can figure all these out and finish the whole program.
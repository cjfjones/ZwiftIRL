import React, { useState, useEffect } from 'react'

import Header from './header'
import Label from './label'
import Footer from './footer'

import Images from '../images'
import PowerUps from '../powerups'

function App() {
    const canvasSize = { width: 1920, height: 1080 }
    
    const [photo, setPhoto] = useState(null)
    const [name, setName] = useState('Zwift IRL 🏳️‍🌈')
    const [friend, setFriend] = useState('')
    const [route, setRoute] = useState('')
    const [watts, setWatts] = useState(randomWatts())
    const [powerup, setPowerup] = useState(-1)
    
    const [composition, setComposition] = useState(null)
    
    function composeImage(backgroundPhoto) {
        const canvas = document.createElement('canvas')
        canvas.width = canvasSize.width
        canvas.height = canvasSize.height
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

        // Background image
        const drawWidth = canvasSize.width
        const drawHeight = drawWidth / backgroundPhoto.width * backgroundPhoto.height
        const drawY = (canvasSize.height - drawHeight) / 2
        ctx.drawImage(backgroundPhoto, 0, drawY, drawWidth, drawHeight)
        
        // Top bar with distance, time etc
        ctx.drawImage(Images.topBar, 620, 20)
        ctx.fillStyle = "#fff";
        
        // Power box
        ctx.drawImage(Images.power, 20, 20)
        ctx.fillStyle = "#fff";
        ctx.font = canvasFont(105)
        ctx.textAlign = 'right';
        ctx.fillText(Math.min(Math.abs(watts), 9999), 278, 125)
        
        // Power up
        if (powerup >= 0) {
            ctx.drawImage(PowerUps[powerup].image, 320, 30)
        }

        // Map
        ctx.drawImage(Images.map, 1454, 24)
        
        // Made with
        ctx.drawImage(Images.madeWith, 25, 990)
        
        // Riders
        ctx.drawImage(friend ? Images.riders2 : Images.riders1, 1563, 340)
        ctx.font = canvasFont(24)
        ctx.textAlign = 'right';
        ctx.fillText(name, 1887, 622)
        if (friend) {
            ctx.fillText(friend, 1887, 566)
        }        
        
        if (route) {
            // Route badge box
            ctx.drawImage(Images.route, 0, 650)
            ctx.textAlign = 'right';
            ctx.font = canvasFont(70)
            ctx.fillStyle = "#fff";
            ctx.fillText(route, 1547, 880)
            ctx.fillStyle = "#000";
            ctx.fillText(route, 1545, 878)
        }
        
        setComposition(canvas.toDataURL('image/jpeg', 0.95))
    }

    function readImageUpload(e) {
        const target = e.target;
        if (target.files && target.files[0] ) {
            const FR = new FileReader()
            FR.onload = function(progress) {
                const img = new Image()
                img.src = progress.target.result
                img.onload = function() {
                    setPhoto(img)
                    composeImage(img)
                };                
            };
            FR.readAsDataURL(target.files[0])
        }
    }
    
    function canvasFont(size) {
        return '700 ' + size + 'px Kanit'
    }

    function randomWatts() {
        return 100 + Math.floor(Math.random() * Math.floor(200))
    }

    function onNameChanged(value) { setName(value) }    
    function onFriendChanged(value) { setFriend(value) }    
    function onRouteChanged(value) { setRoute(value) }    
    function onWattsChanged(value) { setWatts(value) }    
    function onPowerupChanged(value) { setPowerup(parseInt(value)) }
        
    function onFormSubmit(e) {
        e.preventDefault()
        composeImage(photo)
    }

    const powerupOptions = PowerUps.map((powerUp, index) =>
        <option value={index.toString()} key={index}>{powerUp.name}</option>
    );
    
    return (
        <>
            <Header />
            <div className="bg-gray-500 max-w-3xl md:rounded mx-auto my-4 p-4">
                <div className="flex items-center">
                    <div className="flex-none bg-orange text-white font-bold w-8 h-8 rounded-full text-center pt-1">1</div>
                    <div className="flex-none pl-2 text-white md:text-lg">Add a photo:</div>
                    <div className="pl-2 overflow-hidden max-w-2xl">
                        <input type="file" onChange={(e) => readImageUpload(e)} />
                    </div>
                </div>
            </div>
            {photo ?
                <div className="bg-gray-500 max-w-3xl md:rounded mx-auto my-4 p-4">
                    <form onSubmit={(e) => onFormSubmit(e)}>
                        <div className="flex items-center pb-3 border-b border-gray-600 mb-2">
                            <div className="bg-orange text-white font-bold w-8 h-8 rounded-full text-center pt-1">2</div>
                            <div className="pl-2 text-white md:text-lg">Customize!</div>
                        </div>
                        <div className="md:flex md:border-b border-gray-600 md:mb-2">
                            <div className="pr-6 mb-2">
                                <Label>Power-up:</Label>
                                <select id="lang" onChange={(e) => onPowerupChanged(e.target.value)} value={powerup}>
                                    <option value="-1">None</option>
                                    {powerupOptions}
                                </select>
                            </div>
                            <div className="pr-6 mb-2">
                                <Label>Route badge:</Label>
                                <input type="text" value={route} onChange={(e) => onRouteChanged(e.target.value)}
                                       className="bg-gray-700 text-white p-1 rounded placeholder-gray-500" placeholder="Make up a route!"/>
                            </div>
                            <div className="pr-6 mb-2">
                                <Label>Watts:</Label>
                                <input type="number" min="0" max="2000" step="1" value={watts}
                                       onChange={(e) => onWattsChanged(e.target.value)}
                                       className="bg-gray-700 text-white p-1 rounded"/>
                            </div>
                        </div>
                        <div className="md:flex border-b border-gray-600 mb-3">
                            <div className="pr-6 mb-2">
                                <Label>Your name:</Label>
                                <input type="text" value={name} onChange={(e) => onNameChanged(e.target.value)} placeholder="Add your name"
                                       className="bg-gray-700 text-white p-1 rounded placeholder-gray-500"/>
                            </div>                            
                            <div className="pr-6 mb-2">
                                <Label>Friend name:</Label>
                                <input type="text" value={friend} onChange={(e) => onFriendChanged(e.target.value)} placeholder="With someone?"
                                       className="bg-gray-700 text-white p-1 rounded placeholder-gray-500"/>
                            </div>
                        </div>
                        <div className="">
                            <button className="bg-orange py-1 px-8 rounded text-white font-semibold">Update</button>
                        </div>
                    </form>
                </div>
                :
                <div className="bg-gray-800 mx-auto text-white text-center mt-10 text-lg mb-32 px-12">
                    To get started, add a photo of your real life ride.
                </div>
            }
            {
                composition &&
                <>
                    <div className="bg-gray-800 mx-auto max-w-6xl">
                        <img src={composition} />
                    </div>      
    
                    <div className="bg-gray-500 max-w-3xl md:rounded mx-auto my-4 p-4">
                        <div className="flex items-center">
                            <div className="flex-none bg-orange text-white font-bold w-8 h-8 rounded-full text-center pt-1">3</div>
                            <div className="pl-2 text-white md:text-lg">Save or copy the image above. If this doesn't work for you, <a href={composition} download="ZwiftIRL.jpg" className="text-orange font-semibold">download it here</a> instead.</div> 
                        </div>  
                    </div>
                </>
            }
            
            <div style={{fontFamily: 'Kanit', fontWeight: 700}}>&nbsp;</div>
            <Footer />
        </>
    )
}

export default App;

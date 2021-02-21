import React, { useState, useEffect, useRef } from 'react'

import Toggle from './toggle'

function App() {
    const canvasSize = { width: 1920, height: 1080 }
    
    const [photo, setPhoto] = useState(null)
    const [watts, setWatts] = useState(randomWatts())
    const [route, setRoute] = useState('')
    
    const canvasRef = useRef(null)

    useEffect(() => {
        if (photo) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)
            
            const drawWidth = canvasSize.width
            const drawHeight = drawWidth / photo.width * photo.height
            const drawY = (canvasSize.height - drawHeight) / 2
            ctx.drawImage(photo, 0, drawY, drawWidth, drawHeight)

            ctx.fillStyle = "#fff";
            ctx.font = '48px sans-serif'
            ctx.fillText(watts + 'w', 10, 50)
            ctx.fillText(route, 10, 150)
        }
    })

    function readImageUpload(e) {
        const target = e.target;
        if (target.files && target.files[0] ) {
            const FR = new FileReader()
            FR.onload = function(progress) {
                const img = new Image()
                img.src = progress.target.result
                img.onload = function() {
                    setPhoto(img)
                };                
            };
            FR.readAsDataURL(target.files[0])
        }
    }

    function randomWatts() {
        return 100 + Math.floor(Math.random() * Math.floor(200))
    }

    function onRouteBadgeToggle(checked) {
        setRoute(checked ? 'My route' : '')
    }

    return (
        <div className="">
            <div className="bg-orange p-4 text-center mb-8">
                <h1 className="text-4xl font-semibold text-white">Zwift IRL</h1>
                <p className="pt-2">Zwift, but in real life. For posting on Strava, Instagram etc.</p>
            </div>
            <div className="bg-gray-500 rounded mx-auto my-4 w-800 p-4">
                <div className="flex items-center">
                    <div className="bg-orange text-white font-bold w-8 h-8 rounded-full text-center pt-1">1</div>
                    <div className="pl-2 text-white font-semibold text-lg">Add a photo:</div>
                    <div className="pl-2">
                        <input type="file" onChange={(e) => readImageUpload(e)} />
                    </div>
                </div>
            </div>
            <div className="bg-gray-500 rounded mx-auto my-4 w-800 p-4">
                <div className="flex items-center">
                    <div className="bg-orange text-white font-bold w-8 h-8 rounded-full text-center pt-1">2</div>
                    <div className="pl-2 text-white font-semibold text-lg">Customize!</div>
                </div>
                <div>
                    <Toggle text="Route badge" onChange={onRouteBadgeToggle} />
                </div>
            </div>
            {(photo) ?
                <div className="bg-gray-800 mx-auto w-800">
                    <canvas
                        ref={canvasRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        className="w-800"
                    />
                </div>
                :
                <div className="bg-gray-800 mx-auto w-800 text-white text-center mt-10 text-lg">
                    To get started, add a photo of your <strong>real life</strong> ride.
                </div>
            }
        </div>
    );
}

export default App;
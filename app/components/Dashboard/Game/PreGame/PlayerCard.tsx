'use client'
import Image from 'next/image'
import React from 'react'


function PlayerCard({ name , img }: { name: string, img: any }) {
    
    return (
        <div className='flex flex-col justify-start items-start w-[45%] h-[100%]'>
            <div className="flex flex-col items-center justify-center gap-4 w-full mt-20">
                { img ?
                    <Image
                        src={img}
                        height="1000"
                        width="1000"
                        className="h-60 w-60 object-cover rounded-xl group-hover/card:shadow-xl"
                        alt="thumbnail"
                    />
                    :
                    <div className="flex items-center justify-center h-60 w-60 bg-gray-400 rounded  animate-pulse">
                        <svg
                            className="w-10 h-10 text-gray-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                        >
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                    </div>
                }
                <h1 className='text-white text-xl font-mono'>
                    {name ? name : 'Loading...'}
                </h1>
            </div>
        </div>
    )
}

export default PlayerCard
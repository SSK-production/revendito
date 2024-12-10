"use client"
import React, {useState} from "react"
import Modal from "./adminModal"
import Image from "next/image"
export default function AdminHomePage() {
    return (<>
    {/* Faire la logique de lorsqu'il y a un nouveau report, changer la cloche en cloche avec notif */}
        <div className="flex flex-col gap-3 ">
            <div className="flex flex-col justify-between p-4 pb-8 bg-[#D9D9D9] rounded-lg shadow-md">
                <div className="flex justify-end ">
                    <Image
                        src="/icons/mobil-dashboard/bell.svg"
                        width={25}
                        height={25}
                        alt="bell"
                    />
                </div>
                <div className="flex gap-2  items-center">
                    <Image
                        src="/icons/mobil-dashboard/status-info.svg"
                        width={30}
                        height={30}
                        alt="bell"
                    />
                    <p className="flex items-center">Report</p></div>
            </div>
            <div className="flex flex-col justify-between p-4 pb-8 bg-[#D9D9D9] rounded-lg shadow-md">
                <div className="flex gap-2  items-center mt-4">
                    <Image
                        src="/icons/mobil-dashboard/ban-user.svg"
                        width={35}
                        height={35}
                        alt="ban-user.svg"
                    />
                    <p className="flex items-center">User Ban</p></div>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col justify-between p-4 pb-8 bg-[#D9D9D9] rounded-lg shadow-md">
                    <div className="flex flex-col gap-2  items-center mt-4">
                        <Image
                            src="/icons/mobil-dashboard/bin.svg"
                            width={35}
                            height={35}
                            alt="ban-user.svg"
                        />
                        <p className="flex items-center">Delete Offer </p></div>

                </div>
                {/* Add admin */}
                <div className="flex flex-col justify-between p-4 pb-8 bg-[#D9D9D9] rounded-lg shadow-md">
                    <div className="flex flex-col gap-2  items-center ">
                        <Image
                            src="/icons/mobil-dashboard/add.svg"
                            width={55}
                            height={55}
                            alt="add.svg"
                        />
                        <p className="flex items-center">Add Admin</p></div>

                </div>
            </div>
            <div className="flex justify-between p-4  bg-[#D9D9D9] rounded-lg shadow-md">
                <div className="flex gap-2  items-center">
                    <div className="flex flex-col gap-2 items-center">
                        <Image
                            src="/icons/mobil-dashboard/user-rounded.svg"
                            width={35}
                            height={35}
                            alt="user-rouded.svg"
                        />
                        <p className="flex items-center">1000000</p>
                    </div>
                </div>
                <div className="w-px h-24 bg-black my-4"></div>
                <div className="flex flex-col justify-center gap-2 items-center">
                        <Image
                            src="/icons/mobil-dashboard/page.svg"
                            width={35}
                            height={35}
                            alt="page.svg"
                        />
                        <p className="flex items-center">1000000</p>
                    </div>
            </div>
        </div>
    </>)
}
import React, { useEffect } from 'react'

const Dashboard = () => {

    useEffect(() => {
        console.log("dashboard mounted")
    }, [])

    return (
        <div>Dashboard</div>
    )
}

export default Dashboard
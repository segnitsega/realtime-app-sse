# Football Match Tracker

A real-time football match event logger built with **React**, **TypeScript**, and **Express**.  
This project allows admins to log match events (goals, substitutions, cards, halftime, full-time) and broadcasts them in real-time to users using **Server-Sent Events (SSE)**.  

## Features

- **Admin Panel**
  - Add new matches
  - Log events with details like team, player, substitution, and minute
  - Start, pause, and end matches
- **Real-time Event Timeline**
  - Displays live events with icons and labels
  - Aligns events by team (team A left, team B right)
  - Shows past events on page load
- **SSE Integration**
  - Clients automatically receive real-time updates without polling
- **In-memory Database**
  - All matches and events are stored in a simple in-memory database (`db`)

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Query  
- **Backend:** Node.js, Express, TypeScript  
- **Real-time Communication:** Server-Sent Events (SSE) 
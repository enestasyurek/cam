# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

This is a **Glass Factory Production Tracking System** (Cam Fabrikası Üretim Takip Sistemi) built with React and Vite. The application manages the flow of glass orders through various processing stations in a factory environment.

### Core Architecture

1. **Context-Based State Management**: The application uses React Context (`FabrikaContext`) as the central state management solution. This context manages:
   - Factory stations and their order queues
   - Glass combinations/types with their processing routes
   - Order lifecycle (creation, tracking, status updates)
   - View state management

2. **Station-Based Processing Flow**: Orders flow through predefined stations based on glass type:
   - Kesim (Cutting)
   - Rodaj (Edging)
   - Temper (Tempering)
   - Isıcam (Insulated Glass)
   - Lamine (Laminated Glass)
   - Montaj (Assembly)

3. **Role-Based Views**: The application supports two main view modes:
   - **Admin View**: Overview of all stations and order management
   - **Station View**: Individual station interface for operators

### Key Technical Decisions

- **No Routing Library**: The app uses state-based view switching instead of React Router
- **No UI Framework**: Custom CSS styling without external UI libraries
- **Local State Management**: No Redux or external state management libraries
- **Turkish Language**: All UI text and comments are in Turkish
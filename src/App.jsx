import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LibraryScreen from './screens/LibraryScreen'
import SearchResultsScreen from './screens/SearchResultsScreen'
import ReferenceEntryScreen from './screens/ReferenceEntryScreen'
import SpecEntryScreen from './screens/SpecEntryScreen'
import CommunityNotesScreen from './screens/CommunityNotesScreen'

export default function App() {
  return (
    <div style={{ background: 'var(--color-bg-screen)', minHeight: '100vh' }}>
      <Routes>
        <Route path="/"                          element={<LibraryScreen />} />
        <Route path="/library"                   element={<LibraryScreen />} />
        <Route path="/search"                    element={<SearchResultsScreen />} />
        <Route path="/entry/:slug"               element={<ReferenceEntryScreen />} />
        <Route path="/entry/:slug/spec"          element={<SpecEntryScreen />} />
        <Route path="/entry/:slug/notes"         element={<CommunityNotesScreen />} />
        <Route path="*"                          element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

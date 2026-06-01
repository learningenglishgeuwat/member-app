# DashboardBottomNav Component

Komponen navbar bawah khusus untuk halaman Dashboard.

## Fitur

- **Menu Button**: Toggle sidebar kiri (show/hide)
- **Tour Guide Avatar**: Aktifkan tour guide (tombol tengah dengan avatar)
- **Start Journey Button**: Kembali ke view dashboard utama dan tutup sidebar

## Props

| Prop | Type | Description |
|------|------|-------------|
| `isSidebarOpen` | `boolean` | Status sidebar (terbuka/tertutup) |
| `toggleSidebar` | `(e?: React.MouseEvent) => void` | Fungsi untuk toggle sidebar |
| `isTourGuideBootstrapped` | `boolean` | Status tour guide (aktif/tidak) |
| `handleEnableTourGuide` | `() => void` | Fungsi untuk mengaktifkan tour guide |
| `handleStartJourney` | `() => void` | Fungsi untuk kembali ke dashboard view |

## Perbedaan dengan MobileBottomNav

- **DashboardBottomNav**: Khusus untuk halaman `/dashboard`
  - 3 tombol: MENU, Tour Guide Avatar, MULAI
  - Styling: dashboard-tour-nav theme (purple/indigo)
  
- **MobileBottomNav**: Untuk halaman lain (skill modules, dll)
  - 3 tombol: MENU, Tour Guide Avatar, PROGRESS
  - Styling: geuwat-nav theme (cyan)
  - Tidak muncul di `/dashboard`, `/skill`, dan public paths

## Styling

CSS untuk komponen ini ada di `app/dashboard/dashboard.css`:
- `.dashboard-tour-nav`
- `.dashboard-tour-nav-panel`
- `.dashboard-tour-nav-scan`
- `.dashboard-tour-nav-action`
- `.dashboard-tour-avatar`
- `.dashboard-tour-avatar-image`
- `.dashboard-tour-active-dot`

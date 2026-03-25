import RequireActive from '../components/RequireActive'
import SkillGameButton from './components/SkillGameButton'

export default function SkillLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireActive>
      {children}
      <SkillGameButton />
    </RequireActive>
  )
}

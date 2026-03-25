import RequireActive from '../components/RequireActive'

export default function SkillLayout({ children }: { children: React.ReactNode }) {
  return <RequireActive>{children}</RequireActive>
}


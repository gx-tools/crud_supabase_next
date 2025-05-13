import TodoApp from "../components/todo-app"
import { ThemeProvider } from "../components/theme-provider"
import ThemeToggle from "../components/theme-toggle"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-background transition-colors duration-300">
        <div className="z-10 max-w-xl w-full items-center justify-between">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
              TaskFlow
            </h1>
            <ThemeToggle />
          </div>
          <TodoApp />
        </div>
      </main>
    </ThemeProvider>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Trash2, Plus, CheckCircle2, Edit, Loader2, Server, Database } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/utils/supabase/client"
import { AuthRouteConstants, RouteConstants, SupaBaseTableConstants } from "@/helpers/string_const"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Link from "next/link"
import { fetchApiTasks, createApiTask, updateApiTask, deleteApiTask } from "@/utils/tasks"
import { apiLogout } from "@/utils/auth"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Task } from "@/types/supabase"

const courseLinks = [
  { name: "Courses", path: RouteConstants.STUDENT_DASHBOARD },
];

export default function TodoApp() {
  const [todos, setTodos] = useState<Task[]>([])
  const [newTodo, setNewTodo] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const router = useRouter()
  const [useApi, setUseApi] = useState(false)

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
  const [isTogglingId, setIsTogglingId] = useState<number | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      if (useApi) {
        // Use the API endpoint
        const response = await fetchApiTasks();
        setTodos(response.data || []);
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { data, error } = await supabase.from(SupaBaseTableConstants.TASKS).select("*");
        if (error) throw error;
        setTodos(data);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch todos. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [useApi]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const addTodo = async () => {
    if (newTodo.trim() === "") return;
    try {
      setIsSubmitting(true)
      
      if (useApi) {
        // Use the API endpoint
        if (editingTodoId) {
          await updateApiTask(editingTodoId, { title: newTodo });
          setEditingTodoId(null);
          toast.success("Todo updated successfully!");
        } else {
          await createApiTask(newTodo);
          toast.success("Todo added successfully!");
        }
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        if (editingTodoId) {
          const { error } = await supabase.from(SupaBaseTableConstants.TITLE).update({
            tasks: newTodo
          }).eq(SupaBaseTableConstants.ID, editingTodoId);

          if (error) throw error;
          setEditingTodoId(null);
          toast.success("Todo updated successfully!");
        } else {
          const { error } = await supabase.from(SupaBaseTableConstants.TITLE).insert({
            tasks: newTodo
          }).single();

          if (error) throw error;
          toast.success("Todo added successfully!");
        }
      }
      
      await fetchTodos();
      setNewTodo("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error adding/editing todo:", error);
      toast.error(editingTodoId ? "Failed to update todo" : "Failed to add todo");
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditTodo = (todo: Task) => {
    setNewTodo(todo.title);
    setEditingTodoId(todo.id);
  }

  const toggleTodo = async (id: number) => {
    try {
      setIsTogglingId(id)
      const currentTodo = todos.find((todo) => todo.id === id);
      if (!currentTodo) return;
      
      if (useApi) {
        // Use the API endpoint
        await updateApiTask(id, { completed: !currentTodo.completed });
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { error } = await supabase.from(SupaBaseTableConstants.TASKS).update({
          completed: !currentTodo.completed
        }).eq(SupaBaseTableConstants.ID, id);

        if (error) throw error;
      }
      
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
      )
      toast.success("Todo status updated!");
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast.error("Failed to update todo status");
    } finally {
      setIsTogglingId(null)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      setIsDeletingId(id)
      
      if (useApi) {
        // Use the API endpoint
        await deleteApiTask(id);
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { error } = await supabase.from(SupaBaseTableConstants.TASKS).delete().eq(SupaBaseTableConstants.ID, id);
        if (error) throw error;
      }
      
      setTodos(todos.filter((todo) => todo.id !== id))
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
    } finally {
      setIsDeletingId(null)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      if (useApi) {
        // Use the API endpoint
        await apiLogout();
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      router.push(AuthRouteConstants.LOGIN);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <ul className="flex space-x-4">
          {courseLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.path} className="text-white hover:underline">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24 bg-background transition-colors duration-300">
        <Card className="w-full max-w-md mx-auto shadow-lg border-muted transition-all duration-300">
          <CardHeader className="pb-3 relative">
            <div className="absolute right-4 top-4">
              <ThemeToggle />
            </div>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2 pt-2">
              <CheckCircle2 className="h-7 w-7 text-primary" />
              Todo App
            </CardTitle>
            <div className="flex items-center space-x-2 justify-center mt-2">
              <div className="flex items-center space-x-2">
                <Database className={`h-4 w-4 ${!useApi ? "text-primary" : "text-muted-foreground"}`} />
                <Switch 
                  id="api-toggle"
                  checked={useApi}
                  onCheckedChange={setUseApi}
                />
                <Server className={`h-4 w-4 ${useApi ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <Label htmlFor="api-toggle">{useApi ? "Using API" : "Using Supabase"}</Label>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    addTodo()
                  }
                }}
                disabled={isSubmitting}
                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary dark:bg-background dark:border-muted"
              />
              <Button 
                onClick={addTodo} 
                disabled={isSubmitting}
                className="transition-all duration-200 hover:scale-105"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {editingTodoId ? "Edit" : "Add"}
                    <Plus className="h-5 w-5 ml-1" />
                  </>
                )}
              </Button>
            </div>

            <Button 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="mb-4 transition-all duration-200 hover:scale-105 w-full"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Logout"
              )}
            </Button>

            <AnimatePresence>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : todos.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  No todos yet. Add one above!
                </motion.p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {todos.map((todo) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/30 group dark:bg-muted/10"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            id={`todo-${todo.id}`}
                            disabled={isTogglingId === todo.id}
                            className="transition-all duration-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={`todo-${todo.id}`}
                            className={`transition-all duration-300 ${
                              todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {todo.title}
                          </label>
                          {isTogglingId === todo.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTodo(todo)}
                            disabled={isSubmitting}
                            aria-label="Edit todo"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTodo(todo.id)}
                          disabled={isDeletingId === todo.id}
                          aria-label="Delete todo"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
                        >
                          {isDeletingId === todo.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground pt-0 pb-4">
            <p>Click the {todos.length > 0 ? "checkbox to mark as complete" : "plus button to add a todo"}</p>
          </CardFooter>
        </Card>
      </main>
    </>
  )
}

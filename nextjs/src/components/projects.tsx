"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Trash2, Plus, FolderOpen, Edit, Loader2, Server, Database } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/utils/supabase/client"
import { AuthRouteConstants, RouteConstants, SupaBaseTableConstants } from "@/helpers/string_const"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { fetchApiProjects, createApiProject, updateApiProject, deleteApiProject } from "@/utils/projects"
import { apiLogout } from "@/utils/auth"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Project } from "@/types/supabase"
import Navbar from "@/components/navbar"


export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const router = useRouter()
  const [useApi, setUseApi] = useState(true)

  console.log("::: Projects ::: ");
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

   

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      if (useApi) {
        // Use the API endpoint
        const response = await fetchApiProjects();
        setProjects(response.data || []);
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { data, error } = await supabase.from(SupaBaseTableConstants.PROJECTS).select("*");
        if (error) throw error;
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [useApi]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const addProject = async () => {
    if (newProject.trim() === "") return;
    try {
      setIsSubmitting(true)
      
      if (useApi) {
        // Use the API endpoint
        if (editingProjectId) {
          await updateApiProject(editingProjectId, { title: newProject });
          setEditingProjectId(null);
          toast.success("Project updated successfully!");
        } else {
          await createApiProject(newProject);
          toast.success("Project added successfully!");
        }
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        if (editingProjectId) {
          const { error } = await supabase.from(SupaBaseTableConstants.PROJECTS).update({
            title: newProject
          }).eq(SupaBaseTableConstants.ID, editingProjectId);

          if (error) throw error;
          setEditingProjectId(null);
          toast.success("Project updated successfully!");
        } else {
          const { error } = await supabase.from(SupaBaseTableConstants.PROJECTS).insert({
            title: newProject
          }).single();

          if (error) throw error;
          toast.success("Project added successfully!");
        }
      }
      
      await fetchProjects();
      setNewProject("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error adding/editing project:", error);
      toast.error(editingProjectId ? "Failed to update project" : "Failed to add project");
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProject = (project: Project) => {
    setNewProject(project.title);
    setEditingProjectId(project.id);
  }

  const deleteProject = async (id: string) => {
    try {
      setIsDeletingId(id)
      
      if (useApi) {
        // Use the API endpoint
        await deleteApiProject(id);
      } else {
        // Use Supabase direct access
        const supabase = createClient();
        const { error } = await supabase.from(SupaBaseTableConstants.PROJECTS).delete().eq(SupaBaseTableConstants.ID, id);
        if (error) throw error;
      }
      
      setProjects(projects.filter((project) => project.id !== id))
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
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
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24 bg-background transition-colors duration-300">
        <Card className="w-full max-w-md mx-auto shadow-lg border-muted transition-all duration-300">
          <CardHeader className="pb-3 relative">
            <div className="absolute right-4 top-4">
              <ThemeToggle />
            </div>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2 pt-2">
              <FolderOpen className="h-7 w-7 text-primary" />
              Projects
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
                placeholder="Add a new project..."
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    addProject()
                  }
                }}
                disabled={isSubmitting}
                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary dark:bg-background dark:border-muted"
              />
              <Button 
                onClick={addProject} 
                disabled={isSubmitting}
                className="transition-all duration-200 hover:scale-105"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {editingProjectId ? "Edit" : "Add"}
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
              ) : projects.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  No projects yet. Add one above!
                </motion.p>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/30 group dark:bg-muted/10"
                      >
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-5 w-5 text-primary" />
                          <span className="text-foreground font-medium">
                            {project.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProject(project)}
                            disabled={isSubmitting}
                            aria-label="Edit project"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProject(project.id)}
                          disabled={isDeletingId === project.id}
                          aria-label="Delete project"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
                        >
                          {isDeletingId === project.id ? (
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
            <p>Click the {projects.length > 0 ? "edit icon to modify a project" : "plus button to add a project"}</p>
          </CardFooter>
        </Card>
      </main>
    </>
  )
}

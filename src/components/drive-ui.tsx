"use client"

import { useState } from "react"
import {
  ChevronRight,
  File,
  FileText,
  Folder,
  Grid3X3,
  Home,
  ImageIcon,
  List,
  MoreVertical,
  Plus,
  Settings,
  Star,
  Trash,
  Upload,
} from "lucide-react"

const validFileTypes = ["document" , "image" , "pdf" , "spreadsheet" , "presentation"] as const
type FileTypeKind = typeof validFileTypes[number];
interface FileType {
  id: string;
  name: string;
  type: FileTypeKind;
  size: string;
  modified: string;
}

interface FolderType {
  id: string;
  name: string;
  type: "folder";
  items: (FileType | FolderType)[]; // Recursive definition
}

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import  DarkMode from  "@/components/dark-mode"

// Mock data
const initialFiles:(FileType | FolderType)[] = [
  {
  id: "1",
  name: "Documents",
  type: "folder",
  items: [
    {
      id: "1-1",
      name: "Work",
      type: "folder",
      items: [
        { id: "1-1-1", name: "Project Proposal.docx", type: "document", size: "245 KB", modified: "Apr 12, 2023" },
        { id: "1-1-2", name: "Budget.xlsx", type: "spreadsheet", size: "132 KB", modified: "Apr 15, 2023" },
      ],
    },
    {
      id: "1-2",
      name: "Personal",
      type: "folder",
      items: [
        { id: "1-2-1", name: "Resume.pdf", type: "pdf", size: "420 KB", modified: "Jan 5, 2023" },
        { id: "1-2-2", name: "Tax Return.pdf", type: "pdf", size: "2.3 MB", modified: "Mar 20, 2023" },
      ],
    },
    { id: "1-3", name: "Meeting Notes.docx", type: "document", size: "78 KB", modified: "Apr 2, 2023" },
  ],
  },
  {
  id: "2",
  name: "Photos",
  type: "folder",
  items: [
    {
      id: "2-1",
      name: "Vacation",
      type: "folder",
      items: [
        { id: "2-1-1", name: "Beach.jpg", type: "image", size: "3.2 MB", modified: "Jul 22, 2022" },
        { id: "2-1-2", name: "Mountains.jpg", type: "image", size: "2.8 MB", modified: "Jul 23, 2022" },
      ],
    },
    { id: "2-2", name: "Family.jpg", type: "image", size: "4.5 MB", modified: "Dec 25, 2022" },
  ],
  },
  { id: "3", name: "Project Plan.pdf", type: "pdf", size: "1.2 MB", modified: "Apr 10, 2023" },
  { id: "4", name: "Budget Report.xlsx", type: "spreadsheet", size: "845 KB", modified: "Apr 5, 2023" },
  { id: "5", name: "Presentation.pptx", type: "presentation", size: "4.2 MB", modified: "Apr 8, 2023" },
]

export default function DriveUI() {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentFiles, setCurrentFiles] = useState(initialFiles)
  const [currentFilter, setCurrentFilter] = useState('all')

  // Function to get file icon based on type
  const getFileIcon = (type: string) => {
  switch (type) {
    case "folder":
      return <Folder className="h-6 w-6 text-blue-500" />
    case "document":
      return <FileText className="h-6 w-6 text-blue-600" />
    case "spreadsheet":
      return <FileText className="h-6 w-6 text-green-600" />
    case "presentation":
      return <FileText className="h-6 w-6 text-orange-500" />
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />
    case "image":
      return <ImageIcon className="h-6 w-6 text-purple-500" />
    default:
      return <File className="h-6 w-6 text-gray-500" />
  }
  }

  // Navigate to a folder
  const navigateToFolder = (folder: FolderType, path: string[]) => {
  setCurrentPath([...path, folder.name])
  setCurrentFiles(folder.items || [])
  }

  // Navigate up one level
  const navigateUp = () => {
  if (currentPath.length === 0) return

  let current = initialFiles
  const newPath = [...currentPath]
  newPath.pop()

  // Navigate through the path to find the correct folder
  for (const segment of newPath) {
    const found = current.find((item) => item.name === segment && item.type === "folder");
    if (found) {
      if (found.type === "folder" && 'items' in found && found.items) {
        current = found.items;
      }
    }
  }
  setCurrentPath(newPath)
  setCurrentFiles(current)
  }

  // Handle file upload (mock)
  const handleUpload = () => {
  const input = document.createElement("input")
  input.type = "file"
  input.multiple = true
  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      // Mock adding the files to the current directory
      const newFiles = [...currentFiles]
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if(file){
			newFiles.push({
            id: `new-${Date.now()}-${i}`,
            name: file.name,
            type: file.type.includes("image")
              ? "image"
              : file.type.includes("pdf")
                ? "pdf"
                : file.type.includes("spreadsheet")
                  ? "spreadsheet"
                  : file.type.includes("presentation")
                    ? "presentation"
                    : "document",
            size: `${(file.size / 1024).toFixed(0)} KB`,
            modified: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
			});
        }
      }
      setCurrentFiles(newFiles)
    }
  }
  input.click()
  }
  function isFileType(item: FileType | FolderType): item is FileType {
    return item.type !== "folder" && 'size' in item && 'modified' in item;
  }
  const handleTabChange = (value: string) => {
    setCurrentFilter(value)
  };

  const isValidFileType  = (type: string): type is FileTypeKind => {
    return validFileTypes.includes(type as FileType["type"]);
  }
  

  const renderBlock = (file:FileType|FolderType):JSX.Element => {
    return <Card key={file.id} className="overflow-hidden">
                <div
                  className="flex cursor-pointer flex-col p-4"
                  onClick={() => (file.type === "folder" ? navigateToFolder(file, currentPath) : null)}
                >
                  <div className="flex items-center justify-between">
                    {getFileIcon(file.type)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Move</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium">{file.name}</h3>
                    {file.type !== "folder" && (
                      <p className="text-xs text-muted-foreground">
                        {file.size} • {file.modified}
                      </p>
                    )}
                  </div>
                </div>
              </Card> 
  }

  return (
  <div className="flex h-screen w-screen bg-background">
    {/* Sidebar */}
    <div className="hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <div className="mb-8 flex items-center gap-2">
        <div className="rounded-lg bg-primary p-1">
          <Folder className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-primary">Drive Clone</h1>
      </div>
      

      <Button className="mb-6 w-full justify-start gap-2" onClick={handleUpload}>
        <Plus className="h-4 w-4" />
        <span>New</span>
      </Button>

      <div className="space-y-1 text-foreground">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            setCurrentPath([])
            setCurrentFiles(initialFiles)
          }}
        >
          <Home className="h-4 w-4" />
          <span>My Drive</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Star className="h-4 w-4" />
          <span>Starred</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Trash className="h-4 w-4" />
          <span>Trash</span>
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="mt-auto">
        <div className="mb-2 space-y-1">
          <p className="text-xs text-muted-foreground">Storage</p>
          <Progress value={35} className="h-2" />
          <p className="text-xs text-muted-foreground">3.5 GB of 15 GB used</p>
        </div>
        <Button variant="outline" className="w-full justify-start gap-2 text-foreground">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
    </div>

    {/* Main content */}
    <div className="flex flex-1 flex-col text-muted-foreground">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Input className="max-w-sm" placeholder="Search in Drive" type="search" />
        <div className="ml-auto flex items-center gap-2">
          <DarkMode></DarkMode>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-muted" : ""}
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
          <Button variant="outline" className="gap-2  text-primary" onClick={handleUpload}>
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 border-b px-4 py-2 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCurrentPath([])
            setCurrentFiles(initialFiles)
          }}
        >
          My Drive
        </Button>

        {currentPath.map((segment, index) => (
          <div key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Navigate to this specific path level
                const newPath = currentPath.slice(0, index + 1)
                let current = initialFiles

                for (const segment of newPath) {
                  const found = current.find((item) => item.name === segment && item.type === "folder");
                  if (found) {
                    if (found.type === "folder" && 'items' in found && found.items) {
                      current = found.items;
                    }
                  }
                }

                setCurrentPath(newPath)
                setCurrentFiles(current)
              }}
            >
              {segment}
            </Button>
          </div>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="all" onValueChange={handleTabChange} className="mb-4">
          <TabsList >
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
        </Tabs>

        {currentPath.length > 0 && (
          <Button variant="outline" size="sm" className="mb-4" onClick={navigateUp}>
            ← Back
          </Button>
        )}

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {currentFiles.map((file) => {
              if(currentFilter == 'files'){
                if(!isValidFileType(file.type)){
                  return null
                }
                return renderBlock(file)
              }
              else if(currentFilter == 'folders'){
                if(file.type == 'folder'){
                  return renderBlock(file)
                }
                return null
              }
              return renderBlock(file)
            })}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-2 p-3 font-medium">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-1"></div>
            </div>
            <Separator />
            {currentFiles.map((file) => (
              <div key={file.id}>
                <div
                  className="grid cursor-pointer grid-cols-12 items-center gap-2 p-3 hover:bg-muted/50"
                  onClick={() => (file.type === "folder" ? navigateToFolder(file, currentPath) : null)}
                >
                  <div className="col-span-6 flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <span>{file.name}</span>
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground">{isFileType(file) ? file.modified : "—"}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">{isFileType(file) ? file.size : "—"}</div>
                  <div className="col-span-1 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Move</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  </div>
  )
}



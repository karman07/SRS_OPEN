import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddDialogProps } from "@/types/types";
import { useState } from "react";
import { addTeacher } from "@/api/teachers";
import { X } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BRANCH_OPTIONS = ["CSE-A", "CSE-B", "Electrical", "Mechanical", "Civil", "Architecture"];

export const AddDialog = ({ isOpen, onClose, onAdd }: AddDialogProps) => {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [_, setBranchInput] = useState("");
  const [branches, setBranches] = useState<string[]>([]);

  const [semesterInput, setSemesterInput] = useState("");
  const [semesters, setSemesters] = useState<string[]>([]);

  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);

  const handleAddBranch = (branch: string) => {
    if (branch && !branches.includes(branch)) {
      setBranches([...branches, branch]);
    }
  };

  const handleAddSemester = () => {
    if (semesterInput.trim()) {
      setSemesters([...semesters, semesterInput.trim()]);
      setSemesterInput("");
    }
  };

  const handleAddSubject = () => {
    if (subjectInput.trim()) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const handleRemoveBranch = (index: number) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  const handleRemoveSemester = (index: number) => {
    setSemesters(semesters.filter((_, i) => i !== index));
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const data = { name, branches, semesters, subjects };
      const response = await addTeacher(data);
      onAdd(response);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to add teacher:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setBranches([]);
    setSemesters([]);
    setSubjects([]);
    setBranchInput("");
    setSemesterInput("");
    setSubjectInput("");
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name:</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter teacher name"
            />
          </div>

          {/* Semesters */}
          <div>
            <label className="block text-sm font-medium mb-1">Semesters:</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {semesters.map((sem, i) => (
                <div
                  key={i}
                  className={`${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } px-2 py-1 rounded flex items-center justify-center gap-1`}>
                  {sem}
                  <button
                    onClick={() => handleRemoveSemester(i)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg">
                    <X size={24} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={semesterInput}
                onChange={(e) => setSemesterInput(e.target.value)}
                placeholder="Enter semester"
              />
              <Button type="button" onClick={handleAddSemester}>
                Save
              </Button>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium mb-1">Subjects:</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {subjects.map((sub, i) => (
                <div
                  key={sub}
                  className={`${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } px-2 py-1 rounded flex items-center justify-center gap-1`}>
                  {sub}
                  <button
                    onClick={() => handleRemoveSubject(i)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg">
                    <X size={24} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="Enter subject"
              />
              <Button type="button" onClick={handleAddSubject}>
                Save
              </Button>
            </div>
          </div>

          {/* Branches */}
          <div>
            <label className="block text-sm font-medium mb-1">Branches:</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {branches.map((branch, i) => (
                <div
                  key={i}
                  className={`${
                    theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                  } px-2 py-1 rounded flex items-center justify-center gap-1`}>
                  {branch}
                  <button
                    onClick={() => handleRemoveBranch(i)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg">
                    <X size={24} />
                  </button>
                </div>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  Select Branch
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {BRANCH_OPTIONS.map((branch) => (
                  <DropdownMenuItem
                    key={branch}
                    onClick={() => handleAddBranch(branch)}
                    disabled={branches.includes(branch)}
                  >
                    {branch}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogClose>
          <Button variant="default" onClick={handleSave}>
            Add Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

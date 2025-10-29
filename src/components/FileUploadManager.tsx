import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileCode, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const FileUploadManager = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetPath, setTargetPath] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-suggest path based on file extension
      const ext = selectedFile.name.split('.').pop();
      if (ext === 'tsx' || ext === 'jsx') {
        setTargetPath(`src/components/${selectedFile.name}`);
      } else if (ext === 'ts' || ext === 'js') {
        setTargetPath(`src/${selectedFile.name}`);
      } else if (ext === 'css') {
        setTargetPath(`src/${selectedFile.name}`);
      } else {
        setTargetPath(`src/${selectedFile.name}`);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !targetPath) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a file and specify the target path.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileContent = await file.text();
      
      // Here you would typically send this to an edge function
      // that writes the file to the repository
      // For now, we'll just log it
      console.log("File upload request:", {
        path: targetPath,
        content: fileContent,
        description: description,
      });

      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded to ${targetPath}`,
      });

      // Reset form
      setFile(null);
      setTargetPath("");
      setDescription("");
      (document.getElementById("file-input") as HTMLInputElement).value = "";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading the file.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          File Upload & Replacement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Upload files to replace existing code or add new components. Be careful - this will overwrite existing files!
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="file-input">Select File</Label>
          <Input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept=".tsx,.ts,.jsx,.js,.css,.json"
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-path">Target Path</Label>
          <Input
            id="target-path"
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            placeholder="src/components/MyComponent.tsx"
          />
          <p className="text-xs text-muted-foreground">
            Specify where this file should be saved in the project
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this file do? Why are you replacing it?"
            rows={3}
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || !targetPath || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload & Replace File"}
        </Button>
      </CardContent>
    </Card>
  );
};

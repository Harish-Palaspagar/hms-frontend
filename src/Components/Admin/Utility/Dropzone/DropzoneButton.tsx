import { useRef, useState } from "react";
import { IconCloudUpload, IconDownload, IconX, IconPhoto } from "@tabler/icons-react";
import { Button, Group, Text, useMantineTheme, Paper } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { uploadMediaFile } from "../../../../Services/MediaService";

export function DropzoneButton({ close, form, id }: any) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [files, setFiles] = useState<FileWithPath | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles[0]);
    setUploading(true);
    uploadMediaFile(acceptedFiles[0])
      .then((response) => {
        console.log("File uploaded successfully:", response);
        setFileId(response.id);
        setUploading(false);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setUploading(false);
      });
  };

  const saveHandler = () => {
    form.setFieldValue("profilePictureId", fileId);
    close();
  };

  return (
    <div className="w-full">
      {!files ? (
        <Paper
          className="border-2 border-dashed border-neutral-300 rounded-xl overflow-hidden bg-gradient-to-br from-primary-50/30 to-accent-50/30 hover:border-primary-400 transition-all duration-300"
        >
          <Dropzone
            openRef={openRef}
            multiple={false}
            onDrop={handleDrop}
            radius="md"
            accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
            maxSize={2 * 1024 ** 2}
            className="border-0 bg-transparent"
          >
            <div style={{ pointerEvents: "none" }} className="py-12">
              <Group justify="center">
                <Dropzone.Accept>
                  <IconDownload
                    size={64}
                    color={theme.colors.blue[6]}
                    stroke={1.5}
                    className="animate-bounce"
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX 
                    size={64} 
                    color={theme.colors.red[6]} 
                    stroke={1.5}
                    className="animate-pulse" 
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-xl"></div>
                    <IconCloudUpload
                      size={64}
                      stroke={1.5}
                      className="text-primary-600 relative z-10"
                    />
                  </div>
                </Dropzone.Idle>
              </Group>

              <Text 
                ta="center" 
                fw={700} 
                fz="xl" 
                mt="xl"
                className="text-neutral-800 font-heading"
              >
                <Dropzone.Accept>Drop your image here</Dropzone.Accept>
                <Dropzone.Reject>File must be less than 2MB</Dropzone.Reject>
                <Dropzone.Idle>Upload Profile Picture</Dropzone.Idle>
              </Text>

              <Text 
                ta="center" 
                fz="sm" 
                mt="sm" 
                c="dimmed"
                className="px-8 text-neutral-600"
              >
                Drag and drop your image here, or click the button below to browse.
                <br />
                Accepted formats: <span className="font-semibold text-primary-600">PNG, JPG</span> · 
                Max size: <span className="font-semibold text-primary-600">2MB</span>
              </Text>
            </div>
          </Dropzone>
        </Paper>
      ) : (
        <div>
          <Paper 
            shadow="md" 
            radius="xl" 
            className="overflow-hidden border border-neutral-200"
          >
            <img
              src={URL.createObjectURL(files)}
              alt="preview"
              className="w-full aspect-square object-cover"
            />
          </Paper>
          <Paper 
            shadow="sm" 
            radius="md" 
            p="sm"
            mt="sm"
            className="border border-neutral-100 bg-neutral-50"
          >
            <div className="flex items-center gap-2 text-neutral-700">
              <IconPhoto size={18} />
              <div className="flex-1 min-w-0">
                <Text className="font-semibold truncate text-sm">{files.name}</Text>
                <Text size="xs" className="text-neutral-500">
                  {(files.size / 1024).toFixed(1)} KB
                </Text>
              </div>
            </div>
          </Paper>
        </div>
      )}

      <Group justify="center" mt="xl" gap="md">
        {!files ? (
          <Button
            size="md"
            radius="xl"
            onClick={() => openRef.current?.()}
            variant="filled"
            color="red"
            leftSection={<IconCloudUpload size={18} />}
            className="shadow-md hover:shadow-lg transition-all"
          >
            Select Image
          </Button>
        ) : (
          <>
            <Button
              size="md"
              radius="xl"
              onClick={() => openRef.current?.()}
              variant="outline"
              color="blue"
              className="border-2"
            >
              Change Image
            </Button>
            <Button 
              size="md" 
              radius="xl" 
              onClick={saveHandler}
              variant="filled"
              color="red"
              loading={uploading}
              className="shadow-md hover:shadow-lg transition-all"
            >
              Save Picture
            </Button>
          </>
        )}
      </Group>
    </div>
  );
}
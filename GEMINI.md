I need you to update the **Start Your Project modal form** in my Next.js project.

Tech stack:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- Supabase

Current behavior:
The form only allows users to **write a project description in a textarea**.

What I want:
Add a **file upload option** so users can upload a project document instead of typing everything manually.

Examples of files users may upload:

- PDF
- DOCX
- ZIP
- Images
- Project specification files

Requirements:

1. Add a **file input field below the textarea**.

Example UI:

```
Project Details
[ textarea ]

Upload project file (optional)
[ Choose File ]
```

2. Use React state to store the selected file.

Example:

```
const [file, setFile] = useState<File | null>(null)
```

3. Add a handler function:

```
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return
  setFile(e.target.files[0])
}
```

4. Upload the file to **Supabase Storage** when the user submits the form.

Use a storage bucket called:

```
project-files
```

Example upload logic:

```
const { data, error } = await supabase.storage
  .from("project-files")
  .upload(fileName, file)
```

5. Save the uploaded file path together with the project order in the database.

Example table:

```
project_orders
```

Fields:

```
description
file_url
created_at
```

Important:

- The file upload should be **optional**.
- Users should still be able to submit the form with only text.
- Do not remove the existing UI or animations.
- Keep the code compatible with **Next.js, TypeScript, TailwindCSS and Supabase**.

Goal:
Allow users to either **describe their project in text or upload a project file** to make submitting project requests easier.

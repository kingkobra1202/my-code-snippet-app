# Test script for Appwrite upload
$filePath = "test.txt"
$url = "http://localhost:3001/api/upload-image"

# Create multipart form data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"image`"; filename=`"test.txt`"",
    "Content-Type: text/plain",
    "",
    [System.IO.File]::ReadAllText($filePath),
    "--$boundary--",
    ""
) -join $LF

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines
    Write-Host "Upload successful:"
    Write-Host $response.Content
} catch {
    Write-Host "Upload failed:"
    Write-Host $_.Exception.Response.StatusCode
    Write-Host $_.Exception.Message
}

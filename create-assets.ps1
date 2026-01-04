Add-Type -AssemblyName System.Drawing

# Créer l'icône principale (1024x1024)
$icon = New-Object System.Drawing.Bitmap(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($icon)
$graphics.Clear([System.Drawing.Color]::FromArgb(30, 64, 175))
$font = New-Object System.Drawing.Font("Arial", 200, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.DrawString("S", $font, $brush, 400, 350)
$icon.Save("./assets/icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$icon.Dispose()
$font.Dispose()
$brush.Dispose()

# Copier pour l'icône adaptative
Copy-Item "./assets/icon.png" "./assets/adaptive-icon.png"

# Créer le splash screen (1242x2436)
$splash = New-Object System.Drawing.Bitmap(1242, 2436)
$splashGraphics = [System.Drawing.Graphics]::FromImage($splash)
$splashGraphics.Clear([System.Drawing.Color]::FromArgb(30, 64, 175))
$splashFont = New-Object System.Drawing.Font("Arial", 60, [System.Drawing.FontStyle]::Bold)
$splashBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$splashGraphics.DrawString("Scholaria", $splashFont, $splashBrush, 400, 1200)
$splash.Save("./assets/splash.png", [System.Drawing.Imaging.ImageFormat]::Png)
$splashGraphics.Dispose()
$splash.Dispose()
$splashFont.Dispose()
$splashBrush.Dispose()

# Créer le favicon (48x48)
$favicon = New-Object System.Drawing.Bitmap(48, 48)
$faviconGraphics = [System.Drawing.Graphics]::FromImage($favicon)
$faviconGraphics.Clear([System.Drawing.Color]::FromArgb(30, 64, 175))
$faviconFont = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
$faviconBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$faviconGraphics.DrawString("S", $faviconFont, $faviconBrush, 15, 10)
$favicon.Save("./assets/favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$faviconGraphics.Dispose()
$favicon.Dispose()
$faviconFont.Dispose()
$faviconBrush.Dispose()

Write-Host "Assets crees avec succes !"
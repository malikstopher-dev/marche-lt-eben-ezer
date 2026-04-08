$csv = Get-Content 'C:\Users\stoph\OneDrive\Documents\A WEBSITE\MARCHE LT EBEN_EZER\WEBSITE\marche-recovered\marche_lt_image_pack_output\marche_lt_eben_ezer_248_queries_and_filenames.csv' -Encoding UTF8 | Select-Object -Skip 1
$products = @()
$categories = @{
    'Food' = 'Pantry Staples'
    'Canned Food' = 'Pantry Staples'
    'Dry Goods' = 'Pantry Staples'
    'Frozen Vegetables' = 'Frozen Foods'
    'Frozen Fish' = 'Frozen Foods'
    'Fresh Vegetables' = 'Produce & Greens'
    'Spices' = 'Condiments'
    'Drinks' = 'Beverages'
    'Snacks' = 'Snacks'
    'Household' = 'Maison'
    'Cosmetics' = 'Cosmetics'
    'Medical' = 'Cosmetics'
}

foreach ($line in $csv) {
    $parts = $line -split ','
    if ($parts.Count -ge 6) {
        $id = [int]$parts[0]
        $cat = $parts[1]
        $name = $parts[2] -replace '"', ''
        $details = $parts[3] -replace '"', ''
        $filename = $parts[5] -replace '"', ''
        
        $mappedCat = $categories[$cat]
        if (-not $mappedCat) { $mappedCat = $cat }
        
        $imagePath = "/product_images/" + $filename
        $checkPath = "C:\Users\stoph\OneDrive\Documents\A WEBSITE\MARCHE LT EBEN_EZER\WEBSITE\marche-recovered\public\product_images\" + $filename
        if (-not (Test-Path $checkPath)) {
            $imagePath = '/products/placeholder.svg'
        }
        
        $price = 9.99
        if ($name -match '1kg|1L') { $price = 12.99 }
        elseif ($name -match '2kg|2L') { $price = 22.99 }
        elseif ($name -match '4lb|4kg|4.5L') { $price = 29.99 }
        elseif ($name -match '5LB|5lb') { $price = 24.99 }
        elseif ($name -match '500g|500ml') { $price = 7.99 }
        elseif ($name -match '400g|400ml') { $price = 6.49 }
        elseif ($name -match '750ml') { $price = 9.99 }
        elseif ($name -match '40lbs') { $price = 49.99 }
        elseif ($name -match '15kg') { $price = 59.99 }
        elseif ($name -match '7kg') { $price = 29.99 }
        elseif ($name -match '3L|3l') { $price = 19.99 }
        
        $product = @{
            id = $id
            name = $name
            category = $mappedCat
            subcategory = $cat
            size_pack = $details
            image = $imagePath
            price = $price
            description = ""
            inStock = $true
            visible = $true
            featured = $false
            source = 'csv'
        }
        $products += $product
    }
}
$products | ConvertTo-Json -Depth 10 | Out-File -FilePath 'C:\Users\stoph\OneDrive\Documents\A WEBSITE\MARCHE LT EBEN_EZER\WEBSITE\marche-recovered\public\products.json' -Encoding UTF8
Write-Host "Created products.json with $($products.Count) products"

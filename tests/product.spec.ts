

import { test, expect } from '@playwright/test';

type Product = {
    name: string;
    price: number;
    inStock: boolean;
};

const cat: Product = {
    name: "Tom",
    price: 10,
    inStock: true
};

const dog: Product = {
    name: "Goofy",
    price: 20,
    inStock: true
};

function formatPrice(price: number): string {
    return `$${price}`;
}

test('prise format', async ({ page }) => {
  
    const catPriceFormatted = formatPrice(cat.price);
    console.log(`Cat ${cat.name} - cost is : ${catPriceFormatted}`);
    expect(catPriceFormatted).toBe('$10');

    const dogPriceFormatted = formatPrice(dog.price);
    console.log(`Dog ${dog.name} - cost is : ${dogPriceFormatted}`);
    expect(dogPriceFormatted).toBe('$20');
});
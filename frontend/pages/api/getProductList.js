import axios from 'axios';

export default async function handler(req, res) {
    try {
        const { keyword } = req.query;

        // Get all products from the API
        const apiResponse = await axios.get('https://thebrandtadka.com/api/index.php?mod=ApiMobile&api_key=VarifyTADKA7563&company_id=400&action=getProductList&token=8cc6be81ea4f574acf24aa1aaae2252d');

        // Extract the products list from the API response
        const products = apiResponse.data.Records;

        // If keyword is provided, filter the products
        if (keyword) {
            const filteredResults = products.filter((product) =>
                product.Title.toLowerCase().includes(keyword.toLowerCase())
            );

            res.status(200).json({ Records: filteredResults });
        } else {
            res.status(200).json({ Records: products });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

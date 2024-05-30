import axios from 'axios';

export default async function handler(req, res) {
    const { productId } = req.query;

    try {
        console.log("its reached..")
        const response = await axios.get(`https://thebrandtadka.com/api/index.php?mod=ApiMobile&api_key=VarifyTADKA7563&company_id=400&action=getProductInfo&token=8cc6be81ea4f574acf24aa1aaae2252d&product_id=${productId}`);
        
        res.status(200).json(response.data);
        // res.status(200).json(response);
    } catch (error) {
        console.error(`Error fetching product details for ID ${productId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

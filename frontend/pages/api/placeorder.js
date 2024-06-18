import axios from 'axios';

export default async function handler(req, res) {
    try {
        const { data } = req.body;
        console.log("Brand tadka order body", data);

        // Calculate GST values for each product
        const productsWithGST = data.products.map(product => {
            const totalAmount = product.quantity *product.mrp;
            const cgstValue = (totalAmount * product.gstPerFirst) / 2 / 100;
            const sgstValue = (totalAmount * product.gstPerFirst) / 2 / 100;
            const igstValue = (totalAmount * product.gstPerSecond) / 100;
            const totalGSTValue = cgstValue + sgstValue + igstValue;
            const totalPriceIncludingGST = totalAmount + totalGSTValue;

            return {
                ...product,
                cgst: product.gstPerFirst / 2,
                sgst: product.gstPerFirst / 2,
                igst: product.gstPerSecond,
                gstPer: product.gstPerFirst + product.gstPerSecond,
                cgst_value: cgstValue,
                sgst_value: sgstValue,
                igst_value: igstValue,
                total_gst_value: totalGSTValue,
                net_amount: totalPriceIncludingGST // Assuming net_amount is inclusive of GST
            };
        });

        // Constructing the JSON request object for Brand Tadka API
        const json_request = {
            ref: "forpostorder",
            customer_name: data.customer_name,
            add1: data.address1,
            add2: data.address2 ? data.address2 : '',
            city: data.city,
            state: data.state,
            zip: data.zip,
            phone: data.phone,
            email: data.email,
            country: data.country,
            remark: "",
            bv: 0,
            your_ref_no: data.orderId,
            member_id: "3",
            company_id: "400",
            order_date: data.date,
            order_total_qty: data.quantity,
            order_net_amount: data.total,
            total_points_used: 0,
            total_bv: 0,
            shipping_charges: 0,
            total_cgst_amount: productsWithGST.reduce((sum, item) => sum + item.cgst_value, 0),
            total_sgst_amount: productsWithGST.reduce((sum, item) => sum + item.sgst_value, 0),
            total_igst_amount: productsWithGST.reduce((sum, item) => sum + item.igst_value, 0),
            total_gst_amount: productsWithGST.reduce((sum, item) => sum + item.total_gst_value, 0),
            other_charges: 0,
            gst_exampted: "No",
            coupon_discount_amount: 0,
            order_amount: data.total,
            net_amount: data.total,
            paid_amount: data.total,
            payment_ref_no: "",
            payment_ref_date: data.paymentDate,
            payment_status: data.status,
            Records: productsWithGST.map(product => ({
                product_id: product.id,
                sku_id: product.skuId,
                size_id: product.sizeId,
                color_id: product.colorId,
                qty: product.quantity,
                mrp: product.mrp,
                offer_price: product.offerPrice,
                billing_price: product.offerPrice,
                points_used: 0,
                product_points: 0,
                net_amount: product.net_amount,
                cgst: product.cgst,
                sgst: product.sgst,
                igst: product.igst,
                gst_per: product.gstPer,
                total_gst: product.total_gst_value,
                cgst_value: product.cgst_value,
                sgst_value: product.sgst_value,
                igst_value: product.igst_value,
                total_gst_value: product.total_gst_value,
                hsn_code: product.hsnCode
            }))
        };

        console.log("json request", json_request);

        // Encode the JSON object into URI component format
        const encodedJsonRequest = encodeURIComponent(JSON.stringify(json_request));

        // Construct the API URL with the encoded JSON request
        const apiUrl = `https://thebrandtadka.com/api/index.php?mod=ApiMobile&company_id=400&action=DirectOrderProcess&api_key=VarifyTADKA7563&token=8cc6be81ea4f574acf24aa1aaae2252d&json_request=${encodedJsonRequest}`;

        // Make the POST request to Brand Tadka API
        const response = await axios.post(apiUrl);

        // Handle the response from the API
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error making POST request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

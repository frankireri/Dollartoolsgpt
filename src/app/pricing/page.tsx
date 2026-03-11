import CreditShop from "@/components/shop/CreditShop";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="pt-20">
                <CreditShop />
            </div>

            <section className="py-24 max-w-7xl mx-auto px-4 border-t border-border mt-20">
                <h3 className="text-2xl font-bold text-center mb-16">Frequently Asked Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="glass p-8 rounded-2xl border border-border">
                        <h4 className="font-bold mb-4">How do credits work?</h4>
                        <p className="text-sm text-muted">Each time you use a tool (except for basic text tools which are free), one credit is deducted from your balance. We give 2 free credits to all new users!</p>
                    </div>
                    <div className="glass p-8 rounded-2xl border border-border">
                        <h4 className="font-bold mb-4">Do credits expire?</h4>
                        <p className="text-sm text-muted">No. Once you purchase credits via M-Pesa, they remain in your account until you use them. No monthly pressure.</p>
                    </div>
                    <div className="glass p-8 rounded-2xl border border-border">
                        <h4 className="font-bold mb-4">Can I pay in local currency?</h4>
                        <p className="text-sm text-muted">Yes, we prioritize local payments. You can top up instantly using M-Pesa STK Push from as low as 20 KES.</p>
                    </div>
                    <div className="glass p-8 rounded-2xl border border-border">
                        <h4 className="font-bold mb-4">What if a tool fails?</h4>
                        <p className="text-sm text-muted">Our tools process in your browser. If a tool fails to start, credits are not deducted. If you have any issues, reach out to our support.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const bgContainer = document.getElementById('bg-container');
    const incomeNum = document.getElementById('income-num');
    const incomeSlider = document.getElementById('income-slider');
    const bossAvatar = document.getElementById('boss-avatar');
    const bossQuote = document.getElementById('boss-quote');
    const bossHp = document.getElementById('boss-hp');
    const avatarContainer = document.querySelector('.avatar-container');
    const payBtn = document.getElementById('calc-btn');
    
    // Receipt Modal Elements
    const overlay = document.getElementById('receipt-overlay');
    const receiptContent = document.getElementById('receipt-content');
    const finalVerdict = document.getElementById('final-verdict');
    const receiptMeme = document.getElementById('receipt-meme');
    const closeBtn = document.getElementById('close-receipt');

    // Dynamic Sarcastic Quotes shifting live based on slider interaction!
    const quotes = [
        { threshold: 0, text: "Are you even trying? Produce some GDP." },
        { threshold: 300000, text: "I smell loose change." },
        { threshold: 700000, text: "Ah, the sweet scent of a middle-class salary." },
        { threshold: 1200000, text: "Wait... is that... EXPENDABLE INCOME!?" },
        { threshold: 2200000, text: "YES! MINE! WE ARE BUILDING A NEW HIGHWAY WITH THIS!" },
    ];

    // Bind slider and number field completely together
    function syncInputs(val) {
        val = parseInt(val) || 0;
        
        // Block extremely gigantic numbers for UI overflow safety
        if(val > 5000000) val = 5000000;
        
        incomeNum.value = val;
        incomeSlider.value = val;
        updateBossState(val);
    }

    incomeNum.addEventListener('input', (e) => syncInputs(e.target.value));
    incomeSlider.addEventListener('input', (e) => syncInputs(e.target.value));

    // Animate CSS and DOM attributes live as you drag
    function updateBossState(income) {
        // Calculate max income ratio capped at 30 Lakhs for graphics tracking
        const ratio = Math.min(income / 3000000, 1);
        
        // 1. Health Bar (FM Happiness target focus locks on)
        const hpPercentage = Math.max(5, ratio * 100);
        bossHp.style.width = hpPercentage + "%";

        // 2. Avatar Scalings (Zoom in on face the richer you are!)
        const scale = 1 + (ratio * 0.35); 
        bossAvatar.style.transform = `scale(${scale})`;

        // 3. Background Color Transition Shift (from blue to dark ominous red)
        if (ratio > 0.6) {
            bgContainer.style.background = `rgba(69, 10, 10, ${ratio})`;
            avatarContainer.classList.add('rage'); // triggers eye glow
        } else {
            bgContainer.style.background = `#0f172a`;
            avatarContainer.classList.remove('rage');
        }

        // 4. Update the real-time quote system
        let currentQuote = quotes[0].text;
        for (let q of quotes) {
            if (income >= q.threshold) currentQuote = q.text;
        }
        bossQuote.textContent = `"${currentQuote}"`;
    }

    // Call once to calibrate setup
    syncInputs(incomeNum.value);

    // Formatter utility string
    const formatMoney = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    // Authentic Math Tax Logic Standard
    function getTaxDetails(income) {
        let tax = 0;
        if (income > 300000) tax += Math.min(income - 300000, 300000) * 0.05;
        if (income > 600000) tax += Math.min(income - 600000, 300000) * 0.10;
        if (income > 900000) tax += Math.min(income - 900000, 300000) * 0.15;
        if (income > 1200000) tax += Math.min(income - 1200000, 300000) * 0.20;
        if (income > 1500000) tax += (income - 1500000) * 0.30;

        let isExempt = income <= 700000;
        let finalTax = isExempt ? 0 : Math.floor(tax * 1.04);
        return { baseTax: tax, finalTax, isExempt };
    }

    // Activate The Machine! Generate Print Receipt Animation
    payBtn.addEventListener('click', () => {
        const income = parseFloat(incomeNum.value) || 0;
        const details = getTaxDetails(income);
        
        let verdict = "";
        let img = "";
        
        // Generate Line Items Payload Struct
        const receiptData = [];
        receiptData.push({ label: "Declared Income", value: formatMoney(income) });
        
        if (details.isExempt) {
            receiptData.push({ label: "Middle Class Pity Rebate (-)", value: formatMoney(details.baseTax), sub: true });
            receiptData.push({ label: "Total Liability", value: formatMoney(0), total: true });
            verdict = "YOU SURVIVED... BARELY.";
            img = "no.png";
        } else {
            receiptData.push({ label: "Direct Tax Liability", value: formatMoney(details.baseTax) });
            receiptData.push({ label: "Health & Education Cess (4%)", value: formatMoney(Math.floor(details.baseTax * 0.04)), sub: true });
            receiptData.push({ label: "Existing in India Surcharge", value: "Priceless", sub: true });
            receiptData.push({ label: "Total Govt Seizure", value: formatMoney(details.finalTax), total: true });
            receiptData.push({ label: "What's Left For Groceries", value: formatMoney(income - details.finalTax), total: true });
            verdict = "THANKS FOR THE DONATION!";
            img = "nirmala.avif";
        }

        // Trigger UI Transitions
        receiptContent.innerHTML = '';
        overlay.classList.add('active');
        finalVerdict.textContent = "";
        receiptMeme.src = "";
        
        // Timeouts create a 'Printing Action' cascade feeling
        let delayIntervalMs = 450;
        receiptData.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = `r-item ${item.sub ? 'sub' : ''} ${item.total ? 'total' : ''}`;
            row.innerHTML = `<span>${item.label}</span><span>${item.value}</span>`;
            receiptContent.appendChild(row);

            setTimeout(() => {
                row.classList.add('visible');
            }, delayIntervalMs * (index + 1));
        });

        // Resolve Footer
        setTimeout(() => {
            finalVerdict.textContent = verdict;
            receiptMeme.src = img;
        }, delayIntervalMs * (receiptData.length + 1));
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        // Reset the animation class
        receiptContent.innerHTML = '';
    });
});

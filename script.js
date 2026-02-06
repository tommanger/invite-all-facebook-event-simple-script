(function() {
    const DELAY_BETWEEN_CLICKS = 20;
    const SCROLL_DELAY = 100;
    const MAX_NO_CHANGE_ROUNDS = 3;
    
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function getInviteDialog() {
        // חיפוש הדיאלוג הנכון - זה עם "Invite followers" ו-"INVITES LEFT"
        const dialogs = document.querySelectorAll('[role="dialog"]');
        for (const d of dialogs) {
            if (d.textContent.includes('Invite followers') && d.textContent.includes('INVITES LEFT')) {
                return d;
            }
        }
        return null;
    }
    
    function getInvitesLeft(dialog) {
        const match = dialog.textContent.match(/(\d+)\s*INVITES LEFT/);
        return match ? parseInt(match[1]) : null;
    }
    
    function getScrollContainer(dialog) {
        const checkboxes = dialog.querySelectorAll('[role="checkbox"]');
        if (checkboxes.length === 0) return null;
        
        let element = checkboxes[0].parentElement;
        while (element && element !== dialog) {
            if (element.scrollHeight > element.clientHeight + 50) {
                return element;
            }
            element = element.parentElement;
        }
        return dialog;
    }
    
    async function selectAllInvites() {
        const dialog = getInviteDialog();
        if (!dialog) {
            alert('לא נמצא חלון הזמנות! וודא שלחצת על כפתור Invite');
            return;
        }
        
        const scrollContainer = getScrollContainer(dialog);
        let totalSelected = 0;
        let noChangeRounds = 0;
        let lastSelectedCount = 0;
        
        console.log('מתחיל לבחור אנשים להזמנה...');
        
        while (true) {
            const invitesLeft = getInvitesLeft(dialog);
            console.log(`הזמנות שנותרו: ${invitesLeft}`);
            
            if (invitesLeft !== null && invitesLeft === 0) {
                console.log('הגעת להגבלת ההזמנות!');
                break;
            }
            
            const unchecked = dialog.querySelectorAll('[role="checkbox"][aria-checked="false"]');
            
            if (unchecked.length > 0) {
                for (const checkbox of unchecked) {
                    const currentInvites = getInvitesLeft(dialog);
                    if (currentInvites !== null && currentInvites === 0) break;
                    
                    checkbox.click();
                    totalSelected++;
                    await sleep(DELAY_BETWEEN_CLICKS);
                }
            }
            
            // גלילה למטה
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
            await sleep(SCROLL_DELAY);
            
            const currentSelectedCount = dialog.querySelectorAll('[role="checkbox"][aria-checked="true"]').length;
            const newUnchecked = dialog.querySelectorAll('[role="checkbox"][aria-checked="false"]').length;
            
            console.log(`נבחרו: ${currentSelectedCount}, ממתינים: ${newUnchecked}`);
            
            if (currentSelectedCount === lastSelectedCount && newUnchecked === 0) {
                noChangeRounds++;
                if (noChangeRounds >= MAX_NO_CHANGE_ROUNDS) break;
            } else {
                noChangeRounds = 0;
            }
            lastSelectedCount = currentSelectedCount;
        }
        
        const finalInvitesLeft = getInvitesLeft(dialog);
        alert(`בוצע! נבחרו ${totalSelected} אנשים.\nנותרו: ${finalInvitesLeft} הזמנות`);
    }
    
    selectAllInvites();
})();

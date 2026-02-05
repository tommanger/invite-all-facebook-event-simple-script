(function() {
    const DELAY_BETWEEN_CLICKS = 100;
    const SCROLL_DELAY = 2000;
    const MAX_NO_CHANGE_ROUNDS = 3;
    
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function getInvitesLeft(dialog) {
        const match = dialog.textContent.match(/(\d+)\s*INVITES LEFT/);
        return match ? parseInt(match[1]) : null;
    }
    
    function getScrollContainer(dialog) {
        const allElements = dialog.querySelectorAll('*');
        for (const el of allElements) {
            const style = window.getComputedStyle(el);
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && 
                el.scrollHeight > el.clientHeight &&
                el.querySelectorAll('[role="checkbox"]').length > 0) {
                return el;
            }
        }
        return null;
    }
    
    async function selectAllInvites() {
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) {
            alert('לא נמצא חלון הזמנות! וודא שלחצת על כפתור Invite');
            return;
        }
        
        const scrollContainer = getScrollContainer(dialog);
        if (!scrollContainer) {
            alert('לא נמצא אזור גלילה');
            return;
        }
        
        let totalSelected = 0;
        let noChangeRounds = 0;
        let lastSelectedCount = 0;
        
        console.log('מתחיל לבחור אנשים להזמנה...');
        
        while (true) {
            const invitesLeft = getInvitesLeft(dialog);
            console.log(`הזמנות שנותרו: ${invitesLeft}`);
            
            // עצירה אם הגענו להגבלה
            if (invitesLeft !== null && invitesLeft === 0) {
                console.log('הגעת להגבלת ההזמנות!');
                break;
            }
            
            // מציאת checkboxes לא מסומנים
            const unchecked = dialog.querySelectorAll('[role="checkbox"][aria-checked="false"]');
            
            if (unchecked.length > 0) {
                // לחיצה על כל ה-checkboxes הלא מסומנים
                for (const checkbox of unchecked) {
                    // בדיקה אם עדיין יש הזמנות
                    const currentInvites = getInvitesLeft(dialog);
                    if (currentInvites !== null && currentInvites === 0) {
                        console.log('הגעת להגבלת ההזמנות!');
                        break;
                    }
                    
                    checkbox.click();
                    totalSelected++;
                    await sleep(DELAY_BETWEEN_CLICKS);
                }
            }
            
            // גלילה למטה לטעינת עוד אנשים
            const beforeScroll = scrollContainer.scrollTop;
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
            await sleep(SCROLL_DELAY);
            
            // בדיקה אם נטענו עוד אנשים
            const currentSelectedCount = dialog.querySelectorAll('[role="checkbox"][aria-checked="true"]').length;
            const newUnchecked = dialog.querySelectorAll('[role="checkbox"][aria-checked="false"]').length;
            
            console.log(`נבחרו: ${currentSelectedCount}, ממתינים: ${newUnchecked}`);
            
            // בדיקה אם אין שינוי (הגענו לסוף)
            if (currentSelectedCount === lastSelectedCount && newUnchecked === 0) {
                noChangeRounds++;
                if (noChangeRounds >= MAX_NO_CHANGE_ROUNDS) {
                    console.log('אין עוד אנשים לטעון');
                    break;
                }
            } else {
                noChangeRounds = 0;
            }
            lastSelectedCount = currentSelectedCount;
        }
        
        const finalInvitesLeft = getInvitesLeft(dialog);
        const totalSent = 500 - (finalInvitesLeft || 0);
        alert(`בוצע! נבחרו ${totalSelected} אנשים.\nסה"כ הזמנות שנשלחו: ${totalSent}/500\nנותרו: ${finalInvitesLeft} הזמנות\n\nלחץ "Send invites" לשליחה.`);
    }
    
    selectAllInvites();
})();

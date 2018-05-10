Train homework readme
=====================

This is my Train homework assignment for week 4.  It has several trains already pre-populated (either by myself or persons unknown...)

While I usually write my own CSS and handle my own layout, I wanted to focus on the logic of the assignment this time, so I used Bootstrap.  I also appreciate that Bootstrap makes tables look pretty presentable "almost for free".  Getting mobile responsiveness also "for free" was another plus.

Adding trains should be fairly straightforward; I believe it works according to the spec laid out in the homework instructions.

Other things (I think mainly implementation details) I want to call out are that I didn't use Moment.js (yeah, I know, it was the point of the assignment), so the time logic is handwritten by me; additionally, I want to talk a little bit about how I handled Firebase integration.

The way I calculated time is by converting all times to minutes elapsed since midnight.  This means that my application is NOT aware about days changing.  I could have achieved this by picking an arbitrary point in time and setting that as 0, then measuring minutes elapsed since that date.  Implementation should be fairly straightforward; I expect it to be basically just writing more functions that do the appropriate arithmetic.

I did this homework on Monday afternoon/evening, and I wasn't that comfortable with Firebase integration at that time.  (Well, I won't claim to be now, but I'm certainly better).  I simply set and read snapshot.val() instead of thinking through the logic of pushing and then having to parse whatever Firebase would then do to my data in terms of structure.  On the client-side, I package up all the trains into objects, then push those objects into an array.  This means my communication with Firebase is simply sending an entirely new array every time a train is added, or retrieving the array of objects and doing the appropriate things to parse that.

If you want to see a more thorough understanding of Firebase, you can see my optional multiplayer RPS assignment, which I have also turned in.
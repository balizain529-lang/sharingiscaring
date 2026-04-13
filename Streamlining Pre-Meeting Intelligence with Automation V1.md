# Streamlining Pre-Meeting Intelligence with Automation 🚀

[00:00:00] In the pre AI world, most high stakes meetings started cold. Not because the sales teams were lazy, but because they're busy. We try to solve meeting prep with discipline, telling people to check the CRM or scan LinkedIn. However, the reality is that discipline doesn't scale. AI systems do at True Horizon.

We look at pre-meeting prep as an operational intelligence problem. When your execution is time bound, meaning you have a call starting in 60 minutes, the intelligence has to be delivered, not discovered. You shouldn't have to go looking for 

context. In this video, we're gonna show you how we architected a pre-meeting intelligence layer.

It automatically detects upcoming calls, matches attendees to your CRM memory, and enriches new contacts, and delivers a structured brief right to your inbox before the call starts. It's about ensuring that your teams walk into every single conversation informed by default. I'm gonna hand it over to Zain, our senior AI [00:01:00] engineer, to break down the actual architecture.

He's gonna show you how we handle identity matching and normalization to make sure the data is accurate, and more importantly is delivered on time. Zain, take it away.

Hey, Zain from True Horizon here before we get into the very fun building, and it is very cool. Let's first take a look at our output. This pre-meeting intelligence brief, which popped into my email inbox an hour before an important client call. And what I love about this is I didn't have to do any manual searches in CRM or surf the web or anxiously drink three cups of coffee as I'm trying to figure out what it is they posted on LinkedIn.

That's all right here. So you'll see at the top a link to the meeting. A link to their LinkedIn, which is live and clickable. We'll get to that as well as all the notes pulled from my CRM ~~for this wasn't,~~ this was an existing client. You can see last touch point, deal status, next step discussion, as well as top three priorities for this meeting.

And what's really cool [00:02:00] is you are starting this meeting, this conversation with a strong foot forward so you understand how to frame areas of agreement, disagreement, friction, as well as building towards those next steps. I especially like this last touch point section because it gives qualitative and quantitative information based off of, ~~uh,~~ information gathered from, ~~uh,~~ sales chats.

You'll see here that if I click this link, it actually goes to a live LinkedIn link. Now, let me show you how this works. You'll see here we have a nice little diagram of our three systems being used as part of this pre-meeting intelligence flow. This automation connects to these three systems, your calendar, that knows who you're meeting with and when.

HubSpot, which has all the information you could imagine for your deal pipeline or meeting schedule, or I should say team schedules as well as Apollo, which enriches your contacts with net new [00:03:00] information, say LinkedIn or web search results, but, but nothing connects these three systems while you're on the call or beforehand.

So imagine that the call starting and you're still digging through tabs trying to figure out whether they're VP or director, right? This helps solve that with pre-meeting intelligence, and you'll see this flow has two paths. It pulls from your calendar to see when your next meeting is. Looks them up in the CRM if they're a known contact, and if not, ~~uh,~~ understands that it'll have to conduct research for a new contact.

Normalize that data. So you're getting the same information every time. ~~Uh,~~ I'll call out that template you just viewed, ~~uh,~~ previously. That is where we're normalizing this data so we always know what our next steps are, what potential pain points might be, et cetera. And then that AI brief is sent to us via Gmail as well as a log, ~~uh,~~ a shared history of all the past interactions in a database.

That [00:04:00] will be used for future meetings and, ~~uh,~~ intelligence and just important are the logs because if there's an error or retries, it's of the utmost importance to know if this meaning brief makes it to you in time. And if not, having the proper guardrails in place to get that to you so you're not surprised and caught off balance.

Anyways, I digress. ~~Let's get to building. Alright. Let's get to building. Alright, let's get to building. All right. All right.~~ Here is our workflow, n8n. You can see we have a trigger layer, signal processing, and all these important sections that do what I just showed in our diagram. I wanted to show you our client stack first so you can understand what tech stack they were using.

And then we're going to go through a few live executions showing. Both cases, a net new contact as well as a contact that exists in our n8n. You'll see here that there are native node for HubSpot and then an API call for Apollo, which is a little bit more complicated, but not too much. Okay, jumping to our trigger layer, you'll see that it is scheduled to run every five [00:05:00] minutes and returns events on our calendar, and we can filter not only for external meetings, but meetings within a custom timeframe, in this case, 60 minutes.

You get that calendar event. So for example, I'll have a meeting in the next hour and we will see that it's titled Sales Call with Senior Director of Growth at launchpad, as well as has creator, organizer, and then a dummy email. I've now been promoted to a senior executive at Launchpad. The next step is extracting our attendees so we get rid of any buy emails.

Extra ccs and your own email and provide the information that's needed to pass forward a CRM lookup request. So you'll see here I got a status, the email of my contact, as well as meeting details, which is great. So now that that's cleaned up, we're going to do a CRM. Again, I'm using Google Sheets as a.

Stand in for [00:06:00] a, ~~uh,~~ for the client tech stack. In this case it was, ~~uh,~~ Salesforce. ~~Oh yeah. And one last thing I'll say about this extract attendees node is that stripping out all those other emails is important because you don't wanna send the meeting brief to the wrong person. That's happened before.~~ So we're just ensuring that we have clean data to hit our database request.

We're gonna hit the database request here. ~~And lemme just jump really quickly to this.~~ This is a very simplified version of what many of your CRM likely look like. You have the first name, last name, title, company, phone, as well as that LinkedIn link, which we saw earlier in the email, as well as the lifecycle stage in the list goes on and on.

And what's great is it pools this information and ~~determines whether or not it is.~~ Whether or not our contact is to the CRM in this case, this person is actually not in our CRM, so what would happen next is an API call to a third party service that was able to enrich their contact information, do a web search and pool all this key information for us to reference.

Again, there is no CRM to pull from, but rather we have clean data from that email. As well as [00:07:00] first and last name to conduct a search. Now for our existing client case, this would often be a one minute execution in the background that ultimately pulls all this information and then populates it in our downstream nodes.

So what's really cool is you'll see that we are normalizing this data from our API call, and you can see here. It communicates all this information. Again, this is ~~a, this is a~~ net new. This will be a part of our email template that is now going to be generated by our AI agent. So you'll see here we've received that email, which is a slightly different template because that was a net new contact.

So we have research pulled from our web search API, as well as suggested talking points. So discussed launchpads, recent European expansion and its impact on growth strategy. What strategies did you find most effective in your previous role at Stripe and HubSpot? So you can see that not only ~~are,~~ is it business relevant, but also more [00:08:00] professional oriented.

And then finally, top three meetings ~~for this.~~ Top three priorities for this meeting. Establish relationship and understand their growth challenges, as well as gather insights for market positioning and future expansion plans. ~~Now, I know you might be asking Zane, how does this AI format the brief in a consistent way?~~

~~And that's through a series of system prompts and consistent inputs, which I'll show you now. So the step before this where we normalize all our contact data, helps feed the AI information each and every time, that will render our templates in the way we want and provides full control over the information provided.~~

~~Now, I know you might be wondering, Zane, how the heck do you ensure that the AI agent delivers a consistent brief? Well, we do that through a series of system prompts, and also by providing consistent templates so the robot can output the same template every time. Now, I know you're thinking, how the heck do the ai?~~

~~Oh man. Now I know you're thinking. Alright, how does the AI consistently deliver this output?~~ We have two templates for the bot to refer to. That is part of its system instructions and importantly all that it is made to do after being provided key information from our database pool or our, uh, enrichment and web search calls is exactly that.

~~So, I know the AI brief is really cool, but how does the AI do its job? Let's jump into the system prompt first.~~ As I previously said, we normalize that contact data. So the AI receives consistent information every time to generate its template output. It doesn't think or guess, it just formats the prompt to strict and exact sections.

So you'll see here in our system, prompt. That we have provided a version, ~~use this version instead. Now, I know you're probably thinking how do you consistently generate a meeting brief based off of the information provided?~~ And that really comes down to two things. The system prompt that allows these templated outputs as well as the information going in.

So we already [00:09:00] know when we pull information, either from our existing CRM. Or a web search that we're always, always going to have this information input for consumption by the AI to create our template. So you'll see here that we have a instruction generate pre-meeting intelligence brief for the following meeting.

It has all the details regarding our meeting pooled, and then you can see further down in our system prompt that we have very explicit instructions. You are a pre-meeting intelligence analyst, generate concise actual meeting brief, and you'll see there's grammar and formatting instructions as well as everything you saw in our emails.

A template for existing contacts as well as a template for those contacts who are new. ~~And what's really cool is that given this system, temp system output, you can actually play with the model to see. Different generations. And you know, when you're reg, when you are trying to consider cost of models as well as volume of requests, you can play around with this to see the balance between creative, uh, or I should say, uh, token input, token usage, uh, as well as um, how it formats, uh, creates templates with different tone, man.~~

What's cool is this execution probably takes 30 seconds and saves you minutes, even hours of research and head scratching. And the most exciting part is, is not only the speed but [00:10:00] error logging in case there's incomplete information. So what if there's no attendee email attached or your web search results error out?

What's great is we have safeguards in place. Say something like an email is incorrect and errors out, you'll see it goes to the error path, and then would be logged by an error handling workflow as well as send a notification stating that a brief failed ~~so every execution gets logged. When something goes wrong, you get an alert, but the system bolts descending, not waiting.~~

From a design perspective, these are my main takeaways. One, identity matching is the real bottleneck. Email to CRM. Get that right first. Second, normalize your data before it hits AI consistent input creates consistent output every time. Three net new contacts aren't empty. They're an enrichment opportunity.

Don't skip them. So if it's a custom API service or an HT H-T-T-P-S scrape all, there are many, many options to get that information. Buy web search [00:11:00] and be ahead of the curve rather than, ~~uh,~~ arrive with no data in hand. Four, reliability over cleverness. Doesn't matter how smart the system is if the brief shows up after the meeting.

So handling those errors, getting notifications when things do go wrong, and ultimately logging all conversation history for, ~~uh,~~ even greater and richer intelligence later. If you want this for your team. Every external call starts with a structured brief automatically. That's what we build at True Horizon!

Thanks for watching.~~ If you want this for your team, where every external call starts with a structured brief automatically, that's what we build at True Horizon. Yes, you can have the template, but we're here to tell you that there are so many great AI tools you can incorporate in your workflows today.~~

~~Take a look at the Lincoln description if you'd like a free AI consultation. Thank you so much.~~ 


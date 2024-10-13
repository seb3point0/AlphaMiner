Extract the following information from the message below (enclosed in `[ ]`) and output it as a JSON object with these keys, when values are defined:

```json
[ 
    { 
        "name": "", /* Company or project name */ 
        "stage": "", /* Stage of fundraise [e.g., Pre-seed, Seed, Series A] */ 
        "type": "", /* Fundraise structure [e.g., Equity, SAFE, SAFT, Token Sale, Private Sale] */ 
        "raising": "", /* Amount raising [e.g., $1.5m] */ 
        "fdv": "", /* FDV or token valuation [e.g., $40m] */ 
        "valuation": "", /* Equity valuation if different from FDV [e.g., "$20m" for a 1:2 token ratio] */ 
        "token_ratio": "", /* Token ratio or token warrant ratio [e.g., "1:1", "1:2"] */ 
        "committed": "", /* Amount committed [e.g., $500k] */ 
        "vesting": "", /* Vesting terms for tokens [e.g., "12 month cliff, 24 month linear vesting", "5% unlocked at launch, 95% 3 months cliff and 12 months linear unlock"] */ 
        "investors": [], /* Current or previous investors, including angels, in an array */ 
        "summary": "", /* Brief summary of the company based on the information provided. Do not include information already extracted [e.g., links, valuation, etc] */ 
        "links": { 
            /* Standard links categorized by type; For links with passwords [e.g., "pw", "password", "passcode", "code"], represent them as objects with "link" and "password" [e.g., { "link": "", "password": "" }], otherwise, use the link as a string */ 
            "website": "", 
            "deck": "", /* Recognize different terms "deck", "pitch deck", "pitch" as "deck"); Most common domains are "docsend.com", "pitch.com" */ 
            "whitepaper": "", /* Common as ".pdf" file or domain "docsend.com" */ 
            "blog": "", /* Common domains are "blog.", "medium.com", "mirror.xyz" */ 
            "demo": "", 
            "documentation": "", /* Common domains are "docs." */ 
            "data_room": "", /* Common domains "docsend.com", "notion.site" */ 
            "roadmap": "", 
            "tokenomics": "", 
            "calendar": "", /* Recognize different calendar booking services "calendly.com", "cal.com", "calendar.app.google.com" as "calendar" */ 
            "other": [ 
                /* For links that do not fit into standard categories, include them in an array "other" If a title or description is included (e.g., in markdown links or preceding the link), include them as objects with "link" and "title"; if no title is provided, include the link as a string.  */ 
                "", /* Links with no recognizable title */ 
                { 
                    "link": "", 
                    "title": "" 
                } /* Links with title */ 
            ] 
        }, 
        "socials": { 
            "x": "", /* When twitter.com, convert to x.com */ 
            "linkedin": "", 
            "github.com": "", 
            "discord": "", /* Domain "discord.gg" */ 
            "telegram": "", /* Domain "tg.me" */ 
            "youtube": "" /* Domains "youtube.com" & "youtu.be"*/ 
        }, 
        "team": [ 
            /* Array of team members with "name", "role", "linkedin", "x" */ 
            { 
                "name": "", 
                "role": "", 
                "linkedin": "", 
                "x": "" 
            }, 
            { <team_member_n> } // Add other team members
        ] 
    }, 
    { <company_n> } // Add additional companies
] 
```
**Notes: ** 
If only one valuation is mentioned, set it as the FDV and leave “valuation” empty.
If a token ratio is provided (e.g., “1:2”), calculate the equity valuation as FDV divided by the ratio (e.g., FDV $40m with 1:2 ratio implies equity valuation of $20m). Set “valuation” to the equity valuation and “FDV” to the token valuation.
Phrases like “raising at” or “@” indicate the valuation (e.g., “Raising 3M@50M token” means raising $3M at a $50M FDV).
Include any vesting terms mentioned under “vesting_terms” (e.g., “12 month cliff, 24 month linear vesting” or “5% unlocked at launch, 95% 3 months cliff and 12 months linear unlock”).
Extract links in any format (plain text or markdown). Remove any markdown formatting from the extracted data. Add “https://” to the beginning of the link if it doesn't have it.
Never include any explanations or additional text.

**JSON Formatting Details: **
Only include keys in the JSON object if their values are defined and non-empty. Do not include any keys with empty strings, empty arrays, or empty objects.
Ensure that the output is valid JSON under any circumstances.
NEVER include the “json ” markdown formatting in the output.
The output MUST start with “[” and end with “]”.
Keys should always match those provided above.
NEVER output comments.These are only for instructions.
Include validity checks to make sure characters are properly escaped.
If there are multiple companies, return an array (e.g., [ { <company 1> }, { <company 2> }, {  } ]).
ALWAYS return an array, even if there is only one company (e.g., [ {  } ]).
ALWAYS output the JSON as a single line string with no line breaks (\n).
If the message is not a blurb about a company, return an empty array.
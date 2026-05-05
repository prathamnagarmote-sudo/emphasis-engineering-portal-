import { Question } from "@/types";

export const practiceTests = [
  {
    id: "ethics-test",
    title: "NPPE Practice Exam – National Professional Practice Examination",
    description: "Master the NPPE with our comprehensive simulation. Featuring 100+ high-fidelity questions covering engineering law, professional ethics, and practice. Includes detailed explanations and competency feedback to ensure you pass on your first attempt.",
    image: "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775733026/NPPE-IMAGE-test-1_nsukpy.webp",
    category: "NPPE Preparation",
    duration: 30,
    questions: 100,
    instructor: "Industry Experts",
    level: "Intermediate",
    rating: 4.8,
    reviews: 2847,
    price: 49,
    originalPrice: 99,
    passPercentage: 65
  },
  {
    id: "free-test-1",
    title: "Free Evaluation Test",
    description: "Try out our platform with this free evaluation test featuring instant feedback and explanations.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
    category: "Evaluation",
    duration: 20,
    questions: 20,
    instructor: "Emphasis Engineering",
    level: "Beginner",
    rating: 5.0,
    reviews: 124,
    price: 0,
    originalPrice: 0,
    isFree: true
  }
];

export const practiceQuestions: Question[] = [

{
id:1,
question:"A consulting engineer reused design elements from Client A for Client B without permission. What is this?",
options:[
"Acceptable practice",
"Copyright issue only",
"Confidentiality breach only",
"Violation of both copyright and confidentiality"
],
correctAnswer:3,
explanation: "Reusing specific design elements without permission violates confidentiality to the original client and can infringe on copyright protections of the original design."
},

{
id:2,
question:"A junior engineer discovers overbilling by manager. What should she do?",
options:[
"Ignore",
"Report to client",
"Report anonymously externally",
"Report internally to higher management"
],
correctAnswer:3,
explanation: "Professional ethics require addressing issues internally first by following the chain of command, unless immediate public safety is at risk."
},

{
id:3,
question:"Accepting a kickback for approving false invoices is:",
options:[
"Allowed",
"Acceptable practice",
"Minor issue",
"Fraud and misconduct"
],
correctAnswer:3,
explanation: "Accepting kickbacks is illegal and constitutes professional misconduct and fraud."
},

{
id:4,
question:"Engineer hides serious structural damage to avoid client cost. Which duty is violated?",
options:[
"Client loyalty",
"Adequate knowledge",
"Public safety",
"Professional prestige"
],
correctAnswer:2,
explanation: "The paramount duty of an engineer is to protect the safety, health, and welfare of the public. Hiding damage endangers public safety."
},

{
id:5,
question:"Who is responsible if software-based design fails?",
options:[
"Software developer",
"Shared responsibility",
"Engineering firm",
"No one"
],
correctAnswer:2,
explanation: "The engineering firm that seals and signs the design takes ultimate responsibility for verifying the software's outputs."
},

{
id:6,
question:"Engineer secretly works on side projects in same industry. Issue?",
options:[
"No issue",
"Copyright issue",
"Conflict of interest",
"Pricing issue"
],
correctAnswer:2,
explanation: "Working secretly in the same industry is a conflict of interest and violates loyalty to the primary employer."
},

{
id:7,
question:"Awarding contracts to family without bidding is:",
options:[
"Commission",
"Facility misuse",
"Confidential misuse",
"Self-serving conflict"
],
correctAnswer:3,
explanation: "Awarding contracts to relatives is a direct conflict of interest, specifically a self-serving one."
},

{
id:8,
question:"Practicing in another province without license is:",
options:[
"Allowed",
"Allowed temporarily",
"Illegal",
"Illegal only with title misuse"
],
correctAnswer:2,
explanation: "Engineering is regulated provincially/territorially. Practicing without a license in that specific jurisdiction is illegal."
},

{
id:9,
question:"Role of Investigative Committee?",
options:[
"Final judgment",
"Penalty",
"Mediation",
"Decide if discipline needed"
],
correctAnswer:3,
explanation: "The investigative committee gathers facts to determine if there is enough evidence to forward the case to the discipline committee."
},

{
id:10,
question:"Client refuses to report contamination risk. Engineer must:",
options:[
"Stay silent",
"Resign",
"Report to authorities",
"Offer discount"
],
correctAnswer:2,
explanation: "When public safety or the environment is at risk, the engineer's duty to the public overrides client confidentiality, requiring them to report to authorities."
},

{
id:11,
question:"Corporate failure in safety leading to deaths violates:",
options:[
"Profit principle",
"Safety commitment",
"Procurement",
"Compliance"
],
correctAnswer:1,
explanation: "A corporate failure in safety violates the fundamental commitment to protect the public and workers."
},

{
id:12,
question:"Ignoring safety warnings leading to deaths can result in:",
options:[
"No penalty",
"Civil case",
"Criminal negligence",
"Shutdown"
],
correctAnswer:2,
explanation: "Grossly ignoring safety warnings that lead to death can be prosecuted as criminal negligence causing death."
},

{
id:13,
question:"Worker right when equipment is unsafe:",
options:[
"Demand pay",
"Fix it",
"Refuse work",
"Sue"
],
correctAnswer:2,
explanation: "Occupational health and safety laws guarantee the right to refuse unsafe work without reprisal."
},

{
id:14,
question:"Withdrawing a bid after submission results in:",
options:[
"Allowed",
"Mistake invalid",
"Deposit forfeited",
"Only damages"
],
correctAnswer:2,
explanation: "Under the contract law established in R. v. Ron Engineering, withdrawing a bid usually results in forfeiting the bid deposit (Contract A)."
},

{
id:15,
question:"Ambiguous contract clause is interpreted:",
options:[
"Verbal evidence",
"Estoppel",
"Against drafter",
"Simplest meaning"
],
correctAnswer:2,
explanation: "The contra proferentem rule states that ambiguous clauses are interpreted against the party that drafted them."
},

{
id:16,
question:"Promotion denied based on gender stereotype is:",
options:[
"Valid",
"Discrimination",
"Business decision",
"Management right"
],
correctAnswer:1,
explanation: "Denying a promotion based on gender stereotypes is a violation of human rights and constitutes discrimination."
},

{
id:17,
question:"Unwelcome sexual behaviour at workplace is:",
options:[
"Normal",
"Bad management",
"Sexual harassment",
"Conflict"
],
correctAnswer:2,
explanation: "Any unwelcome sexual behaviour in the workplace is legally defined as sexual harassment."
},

{
id:18,
question:"Sealing drawings without proper review is:",
options:[
"Acceptable",
"Permissible",
"Misconduct",
"Minor issue"
],
correctAnswer:2,
explanation: "An engineer must only seal work they have prepared or thoroughly reviewed. Doing otherwise is professional misconduct."
},

{
id:19,
question:"Foreman modifies sealed drawing without approval:",
options:[
"Copyright issue",
"Acceptable",
"Safety risk",
"Unauthorized practice"
],
correctAnswer:2,
explanation: "Modifying an engineered drawing without the engineer's approval creates a safety risk and nullifies the engineer's responsibility for that change."
},

{
id:20,
question:"An engineer realizes a past design contains a flaw that could cause collapse under heavy snow. The building was constructed 5 years ago. What is the engineer's obligation?",
options:[
"None, the liability period has expired.",
"Wait for the client to report issues.",
"Notify the client and appropriate authorities immediately.",
"Fix the drawings quietly without telling the client."
],
correctAnswer:2,
explanation: "The paramount duty to public safety requires the engineer to act immediately to correct or warn about serious hazards, regardless of when the design was completed."
}

];
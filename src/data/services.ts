import { Service } from "@/types";
export const services: Service[] = [
  {
    id: "US PE",
    title: "US PE",
    description: "US Professional Engineer (P.E.) – MRA Pathway Support​ Guided support for UK Chartered Engineers pursuing U.S. licensure via the NCEES",
    icon: "Briefcase",
    calendlyLink: "https://calendly.com/sayeependke/available-slots",

    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",

    features: [
      "Step-by-step guidance for PE licensing process",
      "Resume & experience documentation support",
      "Interview and technical competency preparation"
    ],

    packages: [
      {
        id: "us-pe-starter",
        title: "International P.E. Application Support",
        price: 199,
        popular: false,
        features: ["2 coaching sessions", "Resume review", "NCEES setup guide", "Email support"]
      },
      {
        id: "us-pe-pro",
        title: "Full NCEES Registration Support",
        price: 499,
        popular: true,
        features: ["6 coaching sessions", "Complete portfolio review", "MRA bypass guidance", "Mock interviews", "Priority support"]
      },
      {
        id: "us-pe-premium",
        title: "Elite Board Transmittal Support",
        price: 899,
        popular: false,
        features: ["12 coaching sessions", "Everything in Pro", "State Board application support", "Direct Slack access", "Validator outreach help"]
      }
    ],
    steps: [
      {
        step: 1,
        title: "Eligibility Check",
        description: "Confirm CEng/IntPE status and MRA eligibility.",
        icon: "CheckSquare"
      },
      {
        step: 2,
        title: "NCEES Account Setup",
        description: "Configure MyNCEES record for MRA bypass.",
        icon: "UserPlus"
      },
      {
        step: 3,
        title: "Credential Verification",
        description: "Liaise with Engineering Council UK for proforma validation.",
        icon: "FileText"
      },
      {
        step: 4,
        title: "State Board Transmittal",
        description: "Direct transmit to participating US state boards.",
        icon: "Send"
      }
    ],
    faqs: [
      {
        question: "1. What is a Professional Engineer (PE) licence in the US?",
        answer: `The PE licence authorises an engineer to offer services to the public, sign and seal engineering documents, and take legal responsibility.`
      },
      {
        question: "2. Who regulates PE licensure in the US?",
        answer: `Licensure is regulated by individual State Boards, coordinated nationally through NCEES.`
      },
      {
        question: "Do all US states have the same PE requirements?",
        answer: `No. Each state has its own rules, but most follow the NCEES model law.`
      },
      {
        question: "What is NCEES?",
        answer: `The National Council of Examiners for Engineering and Surveying (NCEES) manages exams, records, and interstate licensure processes.`
      },
      {
        question: "What is the traditional PE pathway?",
        answer: `Traditionally:
1. Pass FE exam
2. Gain experience
3. Pass PE exam
4. Apply to a State Board`
      },
      {
        question: "Are exams always required?",
        answer: `No. Under certain Mutual Recognition Agreements (MRAs), exams may be waived.`
      },
      {
        question: "What is the UK–US Mutual Recognition Agreement?",
        answer: `It allows UK CEng + IntPE (UK) holders to apply for PE licensure in participating US states without FE/PE exams.`
      },
      {
        question: "Which US states accept the UK–US MRA route?",
        answer: `Participating states include Texas, Georgia, North Carolina, Alaska, Utah, Nevada, Oklahoma, and others.`
      },
      {
        question: "What role does the Engineering Council UK play?",
        answer: `ECUK verifies CEng and IntPE status via a formal proforma sent to NCEES.`
      },
      {
        question: "What is a MyNCEES Record?",
        answer: `It is your central digital file holding:
- education
- experience
- references
- verification documents`
      },
      {
        question: "How many references are required under the MRA?",
        answer: `You must submit five references, but the usual requirement for US-licensed PEs is waived.`
      },
      {
        question: "Do references have to be US PEs?",
        answer: `No. Under the MRA, CEng holders are acceptable referees.`
      },
      {
        question: "Is credential evaluation required?",
        answer: `No. Education and exam credential evaluations are bypassed under the MRA.`
      },
      {
        question: "Is work experience still reviewed?",
        answer: `Yes. Work experience is reviewed by NCEES PE reviewers, then verified by your referees.`
      },
      {
        question: "What is the MRA badge in MyNCEES?",
        answer: `It confirms you are eligible for exam and credential bypasses under the agreement.`
      },
      {
        question: "How long does the NCEES process take?",
        answer: `A well-prepared MyNCEES record typically takes a few weeks once all sections are submitted.`
      },
      {
        question: "What happens after NCEES approval?",
        answer: `You transmit your record to a participating State Board and complete a short state application.`
      },
      {
        question: "Are FE and PE exams always waived?",
        answer: `Yes - only for MRA-participating states. Other states will not accept MRA exemptions.`
      },
      {
        question: "Can I apply to multiple US states?",
        answer: `Yes. Each transmission requires a separate fee per state.`
      },
      {
        question: "Can I later apply to non-MRA states?",
        answer: `Not using the MRA route. Those states may require FE/PE exams.`
      },
      {
        question: "Do I need US work experience?",
        answer: `No. International experience is acceptable if professionally verified.`
      },
      {
        question: "Is an interview required for US PE?",
        answer: `Usually no interview is required under the MRA route.`
      },
      {
        question: "Is the PE licence permanent?",
        answer: `No. PEs must renew licences annually or biennially, with continuing education.`
      },
      {
        question: "What is the most common delay in NCEES applications?",
        answer: `Applicants often forget to submit work entries and send references for verification.`
      },
      {
        question: "Who should I contact before starting the US PE process?",
        answer: `Contact Emphasis Engineering to confirm:
- CEng / IntPE eligibility
- best state strategy
- correct MyNCEES setup

Engineering Council UK: international@engc.org.uk  
NCEES Support: help@ncees.org`
      }
    ],
    // 🔥 ADD THIS (ONLY THIS PART NEW)
    phases: [
      {
        step: 1,
        title: "Eligibility Check",
        description: "Before beginning the application, it is strategically vital to confirm your eligibility.",
        content: `Before starting your US PE journey, you must confirm eligibility.
      

Core Credential Requirements

You must hold two mandatory credentials before initiating the process. These designations serve as the basis for the mutual recognition of professional standing between the U.K. and the U.S.

• Chartered Engineer (CEng) Status: This designation from the U.K. is the primary professional qualification required. It signifies that you have met the U.K.’s rigorous standards for engineering competence and commitment.

• International Professional Engineer (IntPE) Status: In addition to CEng, you must be a registrant in good standing on the U.K. International Registry. The NCEES website explicitly states that you must have IntPE status before proceeding with the application.

A Real-World Example: Initial Inquiry and Eligibility Confirmation

To ensure you are on the correct path before investing time and resources, you should initiate the process by contacting both the Engineering Council and NCEES to confirm your eligibility. After NCEES confirms your eligibility under the MRA you can proceed to the next phase of the application.`
      },
      {
        step: 2,
        title: "Create NCEES Record",
        description: "Set up your official profile",
        content: `Create your NCEES account and begin documentation.

This phase marks the official start of your application. The creation of a MyNCEES account and a
corresponding NCEES Record is the central hub for the entire process. This online profile is where
you will compile, document, and ultimately transmit all required professional information to the
U.S. licensing authorities for review.

As specified on the NCEES website, the first two actions you must take are:

1. Create a MyNCEES account: This is your primary user account and is created at ncees.org.

2. Create an NCEES Record: Within your MyNCEES account, you will initiate an NCEES

Record. This is the platform where you will build your comprehensive professional profile for
evaluation.

Account Setup and MRA-
Specific Adjustments
Because your application is being made under the MRA, the standard NCEES Record requirements
are modified. Bypasses for certain sections will be added because the degree evaluation and
exams/licenses are not required, and the MRA badge will be included in the account.
Once your account structure is in place with the MRA-specific adjustments, the detailed work of
populating it with professional information can begin.`
      },
      {
        step: 3,
        title: "Credential Verification",
        description: "Submit and verify documents",
        content: `Submit required documents for verification.

This phase is the most substantial part of the application process. It requires you to meticulously
document your education, work experience, and professional standing according to the specific
requirements of both NCEES and the Engineering Council.
MRA Multistate Section Requirements
You must complete five core sections within your NCEES Record.

1. Education Information: You must send unofficial transcripts and diplomas directly to
NCEES at transcripts@ncees.org.

2. Work Experience: You must document your engineering work experience. When selecting
individuals to verify this experience, respondents who are CEng or P.E. holders are
recommended when possible.

3. Exam and License Verification: The Fundamentals of Engineering (FE) and Principles and
Practice of Engineering (PE) exams are waived for you as an MRA applicant. However, you
must formally request verification of your CEng and IntPE status. To do this, you must
download, complete, and send the official engc-ncees-proforma form to
international@engc.org.uk. The Engineering Council then validates this form, confirming
“that the applicant has not been subject to disciplinary action for misconduct or incompetence and is a registrant in good standing.” This validated document is then
forwarded directly to NCEES and attached to your record.

4. Professional References: A total of five references are required to attest to your professional
reputation. It is recommended that these references be CEng or P.E. holders.

5. Questions for the Applicant: This section consists of a brief series of questions regarding
your professional registration status and history.

NCEES Record Status Update
After you have submitted your information and the Engineering Council has forwarded the validated
proforma, NCEES will provide a comprehensive status update.
This status update from NCEES serves as a critical progress report, confirming that the UK-based
verifications are complete and the application is moving into the final US-based review stages.
When your work experience completes, you may then Transmit and proceed to the transmittal
steps. Your Record has MRA status which involves bypasses and exceptions and may only be
transmitted to the MRA-participation boards.
This update marks the successful compilation of your record, leading to the final review and
transmittal phase..`
      },
      {
        step: 4,
        title: "Final Application",
        description: "Submit and get licensed",
        content: `Complete final review and submit your application.

This final phase involves the formal submission of your completed NCEES Record to a U.S. state
licensing board. Following this transmittal, you must complete the final application steps required
by that specific state to be granted the P.E. license.

Once all sections of your NCEES Record are populated and verified, you can proceed with the
official transmittal.

1. Achieve Application Completion: All sections of your NCEES Record must be complete.
This is indicated in the system when all items are marked as “green.”

2. Purchase Transmittal: You must purchase a transmittal to a participating member board.
The fee for this service is $100.

3. Receive MRA Badge: Upon completion, your file is given a special MRA badge to notify the
receiving state board of your status under the agreement, ensuring the MRA-specific
waivers and exceptions are applied.

Participating U.S. State Boards
As of the agreement, the following state boards are ready to receive applications under the MRA.
Alaska, Delaware, Georgia, Idaho, Maine, Maryland, Nebraska, Nevada, North Carolina, Oklahoma,
Texas, Utah, Wyoming
State-Specific Licensure Application It is critical to understand that the transmittal of your NCEES Record is not the final step in
obtaining your license. As the official guidance states, “Transmittal of your Record does not
constitute an application for licensure.” After transmitting your record, you must follow up directly
with your chosen state board to complete any additional jurisdictional procedures, submit a statespecific application, and pay any further fees required to be granted the P.E. license.
The U.S.-U.K. Mutual Recognition Agreement provides a highly efficient pathway for qualified
Chartered Engineers to achieve professional licensure in the United States. While the process
requires your careful documentation and strict adherence to the steps outlined by NCEES and the
Engineering Council, it offers the strategic advantage of removing the two most significant hurdles:
the FE and PE exams. By leveraging the professional standing of your CEng and IntPE designations,
the MRA facilitates international mobility and recognizes the high standards of engineering
competence on both sides of the Atlantic`
      }
    ]
  },

  {
    id: "IMECHE",
    title: "IMECHE",
    description: "Chartered Engineer (CEng) – IMechE Professional Registration Support. Structured guidance and coaching for mechanical engineers pursuing Chartered status under UK-SPEC.",
    icon: "Briefcase",
    calendlyLink: "https://calendly.com/sayeependke/available-slots",
    image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&q=80",

    features: [
      "CEng application and competency guidance",
      "Professional review interview preparation",
      "Personalized mentorship for UK engineering standards"
    ],

    packages: [
      {
        id: "ct-team",
        title: "Team Package",
        price: 2999,
        features: [
          "Up to 10 employees",
          "4-week program",
          "Custom curriculum",
          "Progress reports"
        ]
      },
      {
        id: "ct-enterprise",
        title: "Enterprise Package",
        price: 9999,
        features: [
          "Unlimited employees",
          "12-week program",
          "Dedicated trainer",
          "24/7 support",
          "Certification"
        ]
      }
    ],

    // 🔥 ADD THIS
    faqs: [
      {
        question: "What registrations can I apply for through IMechE?",
        answer: `IMechE offers CEng, IEng, and EngTech registration.`
      },
      {
        question: "Do I need to be an IMechE member first?",
        answer: `Yes. Membership and registration are linked in the IMechE system.`
      },
      {
        question: "Can I apply to IMechE from outside the UK?",
        answer: `Yes. IMechE accepts international candidates, with interviews available online.`
      },
      {
        question: "How long does the IMechE application process take?",
        answer: `Usually 4–6 months depending on academic review and interview scheduling.`
      },
      {
        question: "What qualifications are required for CEng with IMechE?",
        answer: `Typically:
- Accredited MEng, or
- Accredited BEng plus Master’s, or
- Demonstrated further learning`
      },
      {
        question: "What if my degree is not accredited?",
        answer: `IMechE offers an academic review process to assess equivalence.`
      },
      {
        question: "Does IMechE require a written report?",
        answer: `Yes. Applicants submit a detailed competence report (~2,000 words).`
      },
      {
        question: "How many sponsors are needed for IMechE?",
        answer: `You need two sponsors, one of whom must normally be CEng.`
      },
      {
        question: "Is an interview required?",
        answer: `Yes. All applicants attend a Professional Review Interview.`
      },
      {
        question: "Can IMechE interviews be conducted online?",
        answer: `Yes. Online interviews are common.`
      },
      {
        question: "What is assessed during the interview?",
        answer: `Your:
- personal responsibility
- technical judgment
- leadership
- ethics and CPD commitment`
      },
      {
        question: "Is CPD mandatory for IMechE registration?",
        answer: `Yes. CPD is required and may be audited.`
      },
      {
        question: "How does Emphasis Engineering help?",
        answer: `We assist with:
- academic strategy
- report structuring
- sponsor alignment
- mock interviews`
      },
      {
        question: "Can I switch from IEng to CEng later?",
        answer: `Yes. Many candidates progress from IEng to CEng.`
      },
      {
        question: "Is IMechE registration internationally recognised?",
        answer: `Yes. It is recognised under international engineering accords.`
      }
    ]

  },
  {
    id: "IET",
    title: "IET",
    description: "Chartered Engineer (CEng) – IET Registration Support. Expert, structured coaching for engineers navigating UK-SPEC requirements through the IET.",
    icon: "Briefcase",
    calendlyLink: "https://calendly.com/sayeependke/available-slots",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80",

    features: [
      "IET registration and application support",
      "Technical report and portfolio guidance",
      "Professional review interview coaching"
    ],

    packages: [
      {
        id: "pm-basic",
        title: "Basic Mentorship",
        price: 299,
        features: [
          "4 sessions/month",
          "Code review",
          "Slack support",
          "Resource library"
        ]
      },
      {
        id: "pm-intensive",
        title: "Intensive Mentorship",
        price: 799,
        features: [
          "8 sessions/month",
          "Pair programming",
          "24/7 Slack access",
          "Project deployment",
          "Portfolio showcase"
        ]
      }
    ],

    // 🔥 FAQs ADDED
    faqs: [
      {
        question: "What professional registrations can I apply for through the IET?",
        answer: `You can apply for:
- Chartered Engineer (CEng)
- Incorporated Engineer (IEng)
- Engineering Technician (EngTech)
- ICT Technician (ICTTech)`
      },
      {
        question: "Do I need to be an IET member before applying?",
        answer: `Yes. You must hold IET membership before submitting a professional registration application.`
      },
      {
        question: "Can I apply to the IET from outside the UK?",
        answer: `Yes. The IET accepts international applicants, and interviews can be conducted online.`
      },
      {
        question: "How long does the IET registration process take?",
        answer: `Typically 4–6 months if your application is well prepared.`
      },
      {
        question: "What qualification do I need for CEng?",
        answer: `Normally:
- Accredited MEng, or
- Accredited BEng plus further learning

Non-accredited degrees are assessed individually.`
      },
      {
        question: "What if my degree is not accredited?",
        answer: `You can still apply through demonstrated competence and professional experience.`
      },
      {
        question: "Does the IET require a technical report?",
        answer: `No. Assessment is based on:
- employment history
- achievements
- competence mapping`
      },
      {
        question: "What is the IET Career Manager?",
        answer: `It is the platform used to:
- build your application
- upload documents
- track progress`
      },
      {
        question: "How many supporters are required?",
        answer: `At least one supporter is required. A second (preferably CEng) is recommended.`
      },
      {
        question: "Is an interview required?",
        answer: `Yes. All applicants must attend a Professional Review Interview.`
      },
      {
        question: "What happens in the interview?",
        answer: `You will:
- give a short presentation
- answer technical questions
- demonstrate competence`
      },
      {
        question: "Can the interview be online?",
        answer: `Yes. Most interviews are conducted via video conference.`
      },
      {
        question: "What happens if I fail?",
        answer: `You receive feedback and can reapply after improvement.`
      },
      {
        question: "Are fees refundable?",
        answer: `No. Application fees are non-refundable.`
      },
      {
        question: "Is international experience accepted?",
        answer: `Yes. If it meets UK-SPEC competence standards.`
      },
      {
        question: "Is CPD required?",
        answer: `Yes. Continuing Professional Development is mandatory.`
      },
      {
        question: "What is a PRA?",
        answer: `A Professional Registration Advisor helps review your application and readiness.`
      },
      {
        question: "Is PRA support mandatory?",
        answer: `No, but it is strongly recommended.`
      },
      {
        question: "How does Emphasis Engineering help?",
        answer: `We provide:
- eligibility checks
- application review
- interview preparation`
      },
      {
        question: "Is IET internationally recognised?",
        answer: `Yes. It aligns with Engineering Council UK and global frameworks.`
      }
    ]

  },

  {
    id: "ICE",
    title: "ICE",
    description: "Chartered Engineer (CEng) – ICE Professional Registration Support. ICE is widely regarded as one of the most demanding UK engineering registrations: it requires a detailed written report mapped to ICE attributes, strong demonstration of personal accountability, and a rigorous panel review covering Health & Safety, Sustainable Development, and whole-life project thinking. We guide you through every stage — attribute mapping, report structuring, sustainability framing, and mock review preparation.",
    icon: "Target",
    calendlyLink: "https://calendly.com/sayeependke/available-slots",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&q=80",

    features: [
      "ICE CEng application and competency guidance",
      "Technical report and evidence portfolio support",
      "Professional review interview preparation"
    ],

    packages: [
      {
        id: "ip-standard",
        title: "Standard Prep",
        price: 600,
        features: [
          "10 mock interviews",
          "Structured feedback reports",
          "Competency guidance",
          "Resource access"
        ]
      },
      {
        id: "ip-premium",
        title: "Premium Prep",
        price: 899,
        features: [
          "25 mock interviews",
          "Advanced competency coaching",
          "Unlimited practice",
          "Interview readiness support",
          "Priority mentorship"
        ]
      }
    ],

    // 🔥 FAQs ADDED
    faqs: [
      {
        question: "What registrations does ICE offer?",
        answer: `ICE offers CEng, IEng, and EngTech through civil-focused routes.`
      },
      {
        question: "Do I need ICE membership first?",
        answer: `Yes. You must be a member of ICE before professional registration.`
      },
      {
        question: "Can I apply to ICE from outside the UK?",
        answer: `Yes. ICE supports international candidates and online reviews.`
      },
      {
        question: "How long does the ICE registration process take?",
        answer: `Typically 6–9 months due to report review and panel scheduling.`
      },
      {
        question: "What qualifications are required for ICE CEng?",
        answer: `Normally:
- Accredited MEng, or
- Equivalent qualifications plus experience`
      },
      {
        question: "Does ICE allow non-accredited degrees?",
        answer: `Yes. ICE assesses competence holistically.`
      },
      {
        question: "Is a written report required?",
        answer: `Yes. ICE requires a detailed professional review report mapped to ICE attributes.`
      },
      {
        question: "How many sponsors are needed for ICE?",
        answer: `Usually a Lead Sponsor plus additional reviewers.`
      },
      {
        question: "Is an interview required?",
        answer: `Yes. ICE conducts a Professional Review interview.`
      },
      {
        question: "How long is the ICE interview?",
        answer: `Between 45 and 60 minutes.`
      },
      {
        question: "Can ICE interviews be done online?",
        answer: `Yes. Virtual interviews are standard for international applicants.`
      },
      {
        question: "What does ICE focus on strongly?",
        answer: `ICE heavily emphasises:
- Health & Safety
- Sustainable Development
- Whole-life project thinking`
      },
      {
        question: "Do I need site experience for ICE?",
        answer: `No. Design, consultancy, and management engineers are equally eligible.`
      },
      {
        question: "What happens if I fail an ICE review?",
        answer: `You receive written feedback and guidance for resubmission.`
      },
      {
        question: "Are ICE fees refundable?",
        answer: `No. Fees are non-refundable.`
      },
      {
        question: "Is CPD required for ICE?",
        answer: `Yes. CPD is mandatory and audited.`
      },
      {
        question: "Does ICE accept international project experience?",
        answer: `Yes, if you demonstrate independent professional judgment.`
      },
      {
        question: "Can I progress from IEng to CEng with ICE?",
        answer: `Yes. Many ICE members do.`
      },
      {
        question: "What is the most common ICE rejection reason?",
        answer: `Weak demonstration of personal accountability.`
      },
      {
        question: "Can ICE registration help outside the UK?",
        answer: `Yes. ICE CEng is widely recognised internationally.`
      },
      {
        question: "How does Emphasis Engineering support ICE candidates?",
        answer: `We provide:
- attribute mapping
- report structuring
- sustainability framing
- mock reviews`
      },
      {
        question: "Do I need a PRA for ICE?",
        answer: `Not mandatory, but strongly advised.`
      },
      {
        question: "Can I apply to ICE and another institution?",
        answer: `Yes, but strategic guidance is recommended.`
      },
      {
        question: "Can I delay my interview if needed?",
        answer: `Yes, but delays may extend timelines significantly.`
      },
      {
        question: "Who should I contact if unsure about ICE eligibility?",
        answer: `General Membership & CEng inquiries:
membership@ice.org.uk

Registration & Academic Assessment:
erp@ice.org.uk

Phone:
+44 (0) 121 227 5948`
      }
    ]

  },

  {
    id: "CANADIAN PEng",
    title: "Canadian P.Eng",
    description: "Professional Engineer (P.Eng.) – Canadian Licensure Support. P.Eng. licensing is regulated provincially — requirements vary between PEO (Ontario), APEGA (Alberta), Engineers & Geoscientists BC, and others. We provide expert guidance on Competency-Based Assessment (CBA) writing across all 34 competencies, validator strategy, NPPE preparation, and end-to-end application support through your provincial regulator.",
    icon: "Globe",
    calendlyLink: "https://calendly.com/sayeependke/available-slots",
    image: "https://images.unsplash.com/photo-1503387762-592dee58c460?w=800&q=80",

    features: [
      "P.Eng application and competency-based assessment support",
      "Experience record and documentation guidance",
      "NPPE (ethics & law exam) preparation",
      "Validator strategy and submission support"
    ],

    packages: [
      {
        id: "cert-self",
        title: "Self-Paced",
        price: 149,
        features: [
          "Full course access",
          "CBA writing templates",
          "Practice exams (NPPE)",
          "Study guides",
          "Community support"
        ]
      },
      {
        id: "cert-guided",
        title: "Instructor-Led",
        price: 449,
        features: [
          "Live mentoring sessions",
          "Personal application review",
          "Unlimited CBA feedback",
          "NPPE preparation",
          "Priority support"
        ]
      }
    ],

    // 🔥 FAQs ADDED
    faqs: [
      {
        question: "What does P.Eng. stand for in Canada?",
        answer: `P.Eng. stands for Professional Engineer, a legally protected title allowing you to practise engineering independently in Canada.`
      },
      {
        question: "Who regulates P.Eng. licences?",
        answer: `Licences are regulated by provincial bodies such as Professional Engineers Ontario (PEO).`
      },
      {
        question: "Can I apply from outside Canada?",
        answer: `Yes. International applicants are accepted if all requirements are met.`
      },
      {
        question: "What experience is required?",
        answer: `You need at least 48 months (4 years) of engineering experience.`
      },
      {
        question: "What is CBA?",
        answer: `Competency-Based Assessment (CBA) evaluates your experience across 34 competencies.`
      },
      {
        question: "How do I write CBA responses?",
        answer: `Use Situation–Action–Outcome format and focus on your personal decisions.`
      },
      {
        question: "Do I need validators?",
        answer: `Yes. Each competency must be validated by someone familiar with your work.`
      },
      {
        question: "Who can be a validator?",
        answer: `Licensed engineers (P.Eng. or equivalent internationally).`
      },
      {
        question: "What is the NPPE?",
        answer: `The National Professional Practice Examination tests ethics, law, and professionalism.`
      },
      {
        question: "Is NPPE mandatory?",
        answer: `Yes. All applicants must pass the NPPE.`
      },
      {
        question: "How is NPPE conducted?",
        answer: `It is a 2.5-hour online exam with multiple-choice questions.`
      },
      {
        question: "How long does the process take?",
        answer: `Typically 12–24 months depending on application completeness.`
      },
      {
        question: "Is P.Eng recognised internationally?",
        answer: `Yes. It is widely recognised through mobility agreements.`
      },
      {
        question: "Can I work without P.Eng?",
        answer: `Yes, but only under supervision. Independent responsibility requires a licence.`
      },
      {
        question: "What is the most common reason for delay?",
        answer: `Weak CBA responses and unresponsive validators.`
      },
      {
        question: "How does Emphasis Engineering help?",
        answer: `We assist with:
- CBA writing
- validator strategy
- NPPE preparation
- application review`
      },
      {
        question: "Is CPD required after licensing?",
        answer: `Yes. Annual CPD is mandatory under the PEAK program.`
      },
      {
        question: "Can international engineers apply?",
        answer: `Yes. International education and experience are accepted if competencies are demonstrated.`
      },
      {
        question: "What happens after approval?",
        answer: `You receive your licence and can legally use the P.Eng. title.`
      },
      {
        question: "Who should I contact for help?",
        answer: `Professional Engineers Ontario (PEO):

General: 416-224-1100  
Licensing: applicants@peo.on.ca  

You can also contact Emphasis Engineering for structured support.`
      }
    ]

  }
];
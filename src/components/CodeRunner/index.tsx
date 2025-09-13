import React, { useState, useEffect } from 'react';
import { questionService } from './services/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import ProblemStatement from './components/ProblemStatement';
import SolutionTab from './components/SolutionTab';
import CodeEditor from './components/CodeEditor';
import { useQuestion } from './hooks/useQuestion';
import { Loader2 } from 'lucide-react';
import type { Question } from './types';

function CodeRunner() {
  // For demo purposes, using hardcoded values
  const collection = 'questions';
  const questionId = '68c559a2592c0d9977b08b8b';
  
  const { question, loading, error } = useQuestion(collection, questionId);
  const [activeTab, setActiveTab] = useState('problem');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Initialize code with boilerplate and custom input with first sample
  useEffect(() => {
    if (question) {
      // Set default language
      const defaultLang = question.allowed_languages[0] || 'python';
      setSelectedLanguage(defaultLang);
      
      // Set boilerplate code if available
      if (question.predefined_boilerplates && question.predefined_boilerplates[defaultLang]) {
        setCode(question.predefined_boilerplates[defaultLang]);
      }
      
      // Set first sample input as default custom input
      if (question.sample_io && question.sample_io.length > 0) {
        setCustomInput(question.sample_io[0].input_text);
      }
    }
  }, [question]);

  // Update code when language changes
  useEffect(() => {
    if (question && question.predefined_boilerplates && question.predefined_boilerplates[selectedLanguage]) {
      setCode(question.predefined_boilerplates[selectedLanguage]);
    } else {
      setCode('');
    }
  }, [selectedLanguage, question]);


/* handleRunCode */
const handleRunCode = async () => {
  setIsRunning(true);

  // show running message immediately
  setOutput('Running...');

  try {
    const resp = await questionService.runCode(
      collection,
      questionId,
      code,
      selectedLanguage,
      customInput
    );

    const result = resp?.result || {};

    // Decode actual outputs (they should already be decoded by the backend)
    const stdout = (result.stdout ?? '').toString().trim();
    const stderr = (result.stderr ?? '').toString().trim();
    const compileOutput = (result.compile_output ?? '').toString().trim();
    const message = (result.message ?? '').toString().trim();

    // Preferred display order:
    // 1) stdout (if present)
    // 2) stderr (if stdout empty)
    // 3) compile_output (if above empty)
    // 4) message or a default note
    let finalOutput = '';
    if (stdout.length > 0) {
      finalOutput = stdout;
    } else if (stderr.length > 0) {
      finalOutput = stderr;
    } else if (compileOutput.length > 0) {
      finalOutput = compileOutput;
    } else if (message.length > 0) {
      finalOutput = message;
    } else {
      // Nothing useful returned — provide a short friendly message
      finalOutput = '(no output)';
    }

    setOutput(finalOutput);
  } catch (err) {
    console.error('Error running code:', err);
    setOutput('Error: Failed to run code. Please try again.');
  } finally {
    setIsRunning(false);
  }
};


/* handleSubmitCode */
const handleSubmitCode = async () => {
  setIsRunning(true);
  setOutput("Submitting code...");

  try {
    const resp = await questionService.submitCode(collection, questionId, code, selectedLanguage);

    // Backend should return something like { token, status_url } or a submission object.
    // Display best-effort feedback:
    if (resp?.token) {
      setOutput(`Submission received. Token: ${resp.token}\nYour submission is being evaluated.`);
    } else if (resp?.message) {
      setOutput(`Submission: ${resp.message}`);
    } else {
      setOutput("Submission received. Evaluation in progress.");
    }
  } catch (err) {
    console.error("Error submitting code:", err);
    setOutput("Error: Failed to submit code. Please try again.");
  } finally {
    setIsRunning(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading question...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Question</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Question Not Found</h1>
          <p className="text-gray-600">The requested question could not be found.</p>
        </div>
      </div>
    );
  }

  // Determine available tabs
  const availableTabs = ['problem'];
  if (question.sample_io && question.sample_io.length > 0) {
    availableTabs.push('samples');
  }
  if (question.solution_code && Object.keys(question.solution_code).length > 0) {
    availableTabs.push('solution');
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        {/* Left Panel - Problem Statement */}
        <div className="w-1/2 bg-gray-800 border-r border-gray-700 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="flex-shrink-0 px-4 bg-gray-900">
              <TabsTrigger value="problem">Problem</TabsTrigger>
           
              {question.solution_code && Object.keys(question.solution_code).length > 0 && (
                <TabsTrigger value="solution">Solution</TabsTrigger>
              )}
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="problem">
                <ProblemStatement question={question} />
              </TabsContent>
              
            
              {question.solution_code && Object.keys(question.solution_code).length > 0 && (
                <TabsContent value="solution">
                  <SolutionTab question={question} />
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <CodeEditor
            question={question}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            code={code}
            onCodeChange={setCode}
            customInput={customInput}
            onCustomInputChange={setCustomInput}
            output={output}
            isRunning={isRunning}
            onRunCode={handleRunCode}
            onSubmitCode={handleSubmitCode}
          />
        </div>
      </div>
    </div>
  );
}

export default CodeRunner;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { radioQuestionList } from '@/data/radioQuestionList';
import { checkboxQuestionList } from '@/data/checkboxQuestionList';
import { useGetCaseById } from '@/hooks/useGetCaseById';
import { useGetAssessmentById } from '@/hooks/useGetAssessmentById';

const AssessmentResult = () => {
    const { id } = useParams<{ id: string }>();
    const { data: caseData, isPending: isCasePending, isError: isCaseError } = useGetCaseById(id || '');
    const { data: assessmentData, isPending: isAssessmentPending, isError: isAssessmentError } = useGetAssessmentById(id || '');
    
    // State for editable suggestions
    const [suggestions, setSuggestions] = useState<{[key: string]: string}>({});
    const [editingSuggestion, setEditingSuggestion] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    const getRQAnswer = (questionIndex: number) => {
        if (!assessmentData) return null;
        
        const rqKeys = ['rq1_answer', 'rq2_answer', 'rq3_answer', 'rq4_answer', 'rq5_answer', 'rq6_answer', 'rq7_answer'];
        return assessmentData[rqKeys[questionIndex] as keyof typeof assessmentData] as boolean;
    };

    const getCQAnswer = (questionIndex: number) => {
        if (!assessmentData) return null;
        
        const cqKeys = ['cq1_answer', 'cq2_answer', 'cq3_answer', 'cq4_answer', 'cq5_answer', 'cq6_answer', 'cq7_answer', 'cq8_answer', 'cq9_answer'];
        return assessmentData[cqKeys[questionIndex] as keyof typeof assessmentData] as string[];
    };

    // Get all unselected criteria across all TRL levels
    const getUnselectedCriteria = () => {
        if (!assessmentData) return [];
        
        const unselectedCriteria: Array<{level: number, question: string, id: string}> = [];
        
        checkboxQuestionList.forEach((questions, levelIndex) => {
            const cqAnswers = getCQAnswer(levelIndex);
            const selectedLabels = cqAnswers || [];
            
            questions.forEach((question) => {
                if (!selectedLabels.includes(question.label)) {
                    unselectedCriteria.push({
                        level: levelIndex + 1,
                        question: question.label,
                        id: `trl${levelIndex + 1}-${question.id}`
                    });
                }
            });
        });
        
        return unselectedCriteria;
    };

    // Handle suggestion editing
    const handleEditSuggestion = (criteriaId: string) => {
        setEditingSuggestion(criteriaId);
    };

    const handleSaveSuggestion = (criteriaId: string, text: string) => {
        setSuggestions(prev => ({
            ...prev,
            [criteriaId]: text
        }));
        setEditingSuggestion(null);
    };

    const handleCancelEdit = () => {
        setEditingSuggestion(null);
    };
  
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Case Details */}
        <Card className="w-full">
          <CardHeader>
            {isCasePending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Loading case details...</span>
              </div>
            ) : isCaseError ? (
              <div className="text-destructive">
                <h2 className="text-xl font-bold">Error Loading Case</h2>
                <p className="text-sm">Unable to load case details</p>
              </div>
            ) : !caseData ? (
              <div className="text-muted-foreground">
                <h2 className="text-xl font-bold">Case Not Found</h2>
                <p className="text-sm">The requested case could not be found</p>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">
                    {caseData.case_title}
                  </CardTitle>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline">{caseData.case_type}</Badge>
                    <Badge variant={caseData.is_urgent ? "destructive" : "secondary"}>
                      {caseData.is_urgent ? "Urgent" : "Not Urgent"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Case ID: {caseData.case_id}</p>
                  <p>Submitted at: {new Date(caseData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardHeader>
          
          {caseData && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm leading-relaxed">{caseData.case_description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Keywords</h3>
                  <p className="text-sm text-muted-foreground">{caseData.case_keywords}</p>
                </div>
  
                {caseData.trl_score && (
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Estimated TRL Level</h3>
                    <Badge variant="outline" className="text-lg px-3 py-1 border-primary">
                      Level {caseData.trl_score}
                    </Badge>
                  </div>
                )}

              </div>
            </CardContent>
          )}
        </Card>

        {/* General Questions */}
        <Card className="w-full">
            <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-2">
                General Assessment Questions
            </CardTitle>
            <p className="text-muted-foreground text-sm">
                Basic questions to evaluate your research progress
            </p>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {radioQuestionList.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/30 flex justify-between items-center">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed font-medium">{question}</p>
                    </div>

                    {/* Assessment Result Badge */}
                    <div className="flex-shrink-0">
                      {isAssessmentPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      ) : getRQAnswer(index) !== null ? (
                        <Badge 
                          variant={getRQAnswer(index) ? "default" : "destructive"}
                          className={`flex items-center justify-center py-1 w-10 ${
                            getRQAnswer(index) 
                              ? "bg-green-500/20 hover:bg-green-600 text-green-500 rounded-sm" 
                              : "bg-red-500/20 hover:bg-red-600 text-red-500 rounded-sm"
                          }`}
                        >
                          {getRQAnswer(index) ? "ใช่" : "ไม่ใช่"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="py-1 w-12">
                          ไม่มีข้อมูล
                        </Badge>
                      )}
                    </div>
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
  
        {/* TRL Evaluation Criteria Section - Always visible */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">TRL Evaluation Criteria</h1>
          <p className="text-muted-foreground">Technology Readiness Level Assessment Questions</p>
        </div>
  
        <div className="grid gap-6">
          {checkboxQuestionList.map((questions, index) => {
            const cqAnswers = getCQAnswer(index);
            
            return (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">
                    TRL Level {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                  {questions.map((question) => {
                    // Check if this question is selected in the assessment
                    const isSelected = cqAnswers && cqAnswers.includes(question.label);
                    
                    return (
                      <div 
                        key={question.id} 
                        className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium bg-primary text-primary-foreground">
                          {question.id}
                        </div>
                        <p className={`text-sm leading-relaxed ${isSelected ? 'text-green-700' : 'text-muted-foreground'}`}>
                          {question.label}
                        </p>
                        {isSelected && (
                          <div className="ml-auto">
                            <Badge variant="outline" className="bg-green-500 text-white border-green-500 text-xs">
                            ✓
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Assessment Status */}
                  {isAssessmentPending ? (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">Loading assessment results...</span>
                      </div>
                    </div>
                  ) : cqAnswers && cqAnswers.length > 0 ? (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 font-medium">
                          {cqAnswers.length} criteria selected for this level
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-muted-foreground">No criteria selected for this level</span>
                      </div>
                    </div>
                  )}
                </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Suggestions Section (Div turns into Textarea with default text) */}
<Card className="w-full">
  <CardHeader>
    <CardTitle className="text-2xl font-bold text-primary mb-2">
      Improvement Suggestions
    </CardTitle>
    <p className="text-muted-foreground text-sm">
      Unselected TRL criteria that could help improve your research readiness level
    </p>
  </CardHeader>

  <CardContent>
    {isAssessmentPending ? (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-muted-foreground">Loading suggestions...</span>
      </div>
    ) : getUnselectedCriteria().length > 0 ? (
      <div className="space-y-4">
        {/* Header with Edit button */}
        <div className="flex justify-end">
          {isEditing ? (
            <>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 mr-2"
                onClick={() => {
                  handleSaveSuggestion("all", suggestions["all"] || '');
                  setIsEditing(false);
                }}
              >
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Fill textarea with either saved suggestion or bullet points
                const defaultText =
                  suggestions["all"] ||
                  getUnselectedCriteria()
                    .map(
                      (criteria) =>
                        `• TRL ${criteria.level}: ${criteria.question}`
                    )
                    .join("\n");
                handleSaveSuggestion("all", defaultText);
                setIsEditing(true);
              }}
              className="text-orange-600 border-orange-300 hover:bg-orange-100"
            >
              Edit Suggestions
            </Button>
          )}
        </div>

        {/* Editable Area */}
        {isEditing ? (
          <Textarea
            value={suggestions["all"] || ''}
            onChange={(e) => handleSaveSuggestion("all", e.target.value)}
            className="min-h-[200px] bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm leading-relaxed text-orange-800 font-medium"
          />
        ) : (
          <div
            className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm leading-relaxed text-orange-800 whitespace-pre-line"
          >
            {suggestions["all"] ? (
              suggestions["all"]
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {getUnselectedCriteria().map((criteria) => (
                  <li key={criteria.id}>
                    <span className="font-medium">TRL {criteria.level}:</span> {criteria.question}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-green-600">✓</span>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Excellent Progress!</h3>
        <p className="text-muted-foreground">
          All TRL criteria have been addressed. Your research appears to be well-developed.
        </p>
      </div>
    )}
  </CardContent>
</Card>

        {/* <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-2">
              Improvement Suggestions
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Unselected TRL criteria that could help improve your research readiness level
            </p>
          </CardHeader>
          <CardContent>
            {isAssessmentPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Loading suggestions...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {getUnselectedCriteria().length > 0 ? (
                  getUnselectedCriteria().map((criteria) => (
                    <div key={criteria.id} className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                            TRL {criteria.level}
                          </Badge>
                          <p className="text-sm leading-relaxed font-medium text-orange-800">
                            {criteria.question}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSuggestion(criteria.id)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-100"
                        >
                          {editingSuggestion === criteria.id ? 'Cancel' : 'Add Suggestion'}
                        </Button>
                      </div>
                      
                      {editingSuggestion === criteria.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Add your suggestion or improvement plan for this criteria..."
                            defaultValue={suggestions[criteria.id] || ''}
                            className="min-h-[80px]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                const textarea = e.target as HTMLTextAreaElement;
                                handleSaveSuggestion(criteria.id, textarea.value);
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                const textarea = document.querySelector(`textarea`) as HTMLTextAreaElement;
                                handleSaveSuggestion(criteria.id, textarea.value);
                              }}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Save Suggestion
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Press Ctrl+Enter to save quickly
                          </p>
                        </div>
                      ) : suggestions[criteria.id] ? (
                        <div className="p-3 bg-white rounded border border-orange-200">
                          <p className="text-sm text-gray-700">{suggestions[criteria.id]}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSuggestion(criteria.id)}
                            className="mt-2 text-orange-600 hover:bg-orange-100"
                          >
                            Edit Suggestion
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-orange-600 italic">
                          Click "Add Suggestion" to add improvement notes for this criteria
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-green-600">✓</span>
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Excellent Progress!</h3>
                    <p className="text-muted-foreground">
                      All TRL criteria have been addressed. Your research appears to be well-developed.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    );
  };

export default AssessmentResult;

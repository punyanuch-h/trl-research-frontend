import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, ArrowLeft, CheckCircle, Pencil, X, Check } from 'lucide-react';
import { radioQuestionList } from '@/data/radioQuestionList';
import { checkboxQuestionList } from '@/data/checkboxQuestionList';
import { useGetCaseById } from '@/hooks/case/get/useGetCaseById';
import { useGetResearcherById } from "@/hooks/researcher/get/useGetResearcherById";
import { useGetCoordinatorByCaseId } from "@/hooks/case/get/useGetCoordinatorByCaseId";
import { useGetAssessmentById } from '@/hooks/case/get/useGetAssessmentById';
import { useUpdateAssessment } from '@/hooks/case/patch/useUpdateAssessment';
import { useUpdateImprovementSuggestion } from '@/hooks/case/patch/useUpdateImprovementSuggestion';
import { useUpdateTrlScore } from '@/hooks/case/patch/useUpdateTrlScore';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const AssessmentResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: caseData, isPending: isCasePending, isError: isCaseError, refetch: refetchCase } = useGetCaseById(id || '');
  const { data: researcherData, isPending: isResearcherPending, isError: isResearcherError } = useGetResearcherById(caseData?.researcher_id || '');
  const { data: coordinatorData, isPending: isCoordinatorPending, isError: isCoordinatorError } = useGetCoordinatorByCaseId(id || '');
  const { data: assessmentData, isPending: isAssessmentPending } = useGetAssessmentById(id || '');
  
  const updateAssessmentMutation = useUpdateAssessment(caseData?.id || '');
  const updateSuggestionMutation = useUpdateImprovementSuggestion();
  const updateTrlScoreMutation = useUpdateTrlScore();

  // State for editable suggestions
  const [suggestions, setSuggestions] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // State for collapsible TRL levels
  const [collapsedLevels, setCollapsedLevels] = useState<{ [key: number]: boolean }>({});

  // State for Editable TRL Level
  const [isEditingTrl, setIsEditingTrl] = useState<boolean>(false);
  const [manualTrl, setManualTrl] = useState<number>(1);
  const [isUpdatingTrl, setIsUpdatingTrl] = useState<boolean>(false);

  useEffect(() => {
    if (assessmentData?.improvement_suggestion) {
      setSuggestions(prev => ({
        ...prev,
        "all": assessmentData.improvement_suggestion
      }));
    }
  }, [assessmentData]);

  // Handle navigation
  const handleBackToCaseDetail = () => {
    navigate(`/case-detail/${id}`);
  };

  const handleApproveAssessment = async () => {
    const currentTrlScore = caseData?.trl_score;
    const estimatedTrl = assessmentData?.trl_estimate;
    const caseId = caseData?.id || id;
    const assessmentId = assessmentData?.id;

    try {
      if (currentTrlScore === null || currentTrlScore === undefined) {
        if (estimatedTrl !== undefined) {
          await updateTrlScoreMutation.mutateAsync({
            caseId: caseId,
            trlData: { trl_score: estimatedTrl }
          });
          console.log("Auto-filled TRL Score with Estimate:", estimatedTrl);
        }
      }

      if (assessmentId && !assessmentData?.improvement_suggestion) {
        const defaultSuggestion = getUnselectedCriteria()
          .map((criteria) => `• TRL ${criteria.level}: ${criteria.question}`)
          .join("\n");
        
        if (defaultSuggestion) {
          await updateSuggestionMutation.mutateAsync({
            assessmentId: assessmentId,
            suggestionData: { improvement_suggestion: defaultSuggestion }
          });
        }
      }

      updateAssessmentMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success(`Approved research ID: ${caseData?.id} successfully`);
          navigate('/admin-homepage');
        },
        onError: () => {
          toast.error('Failed to approve research ID: ' + caseData?.id);
        }
      });
    } catch (error) {
      console.error("Error during approval process:", error);
      toast.error('กระบวนการ Approve ขัดข้อง โปรดลองอีกครั้ง');
    }
  };

  const handleEditTrlClick = (currentLevel: number) => {
    setManualTrl(currentLevel);
    setIsEditingTrl(true);
  };

  const handleSaveTrlLevel = async () => {
    const caseId = caseData?.id || id;

    if (!caseId) {
      toast.error("Error: Missing Data IDs");
      return;
    }

    setIsUpdatingTrl(true);
    try {
      const previousTrl = Number(caseData?.trl_score ?? assessmentData?.trl_estimate);
      try {
        // Update Case TRL Score
        await updateTrlScoreMutation.mutateAsync({
          caseId: caseId,
          trlData: { trl_score: manualTrl }
        });
      } catch (error) {
        console.error("Error updating TRL Score:", error);
        throw new Error('Failed to update TRL Level on case. Please try again.');
      }

      // Re-fetch both to ensure UI is in sync
      await Promise.all([
        refetchCase(),
      ]);

      if (manualTrl !== previousTrl) {
        toast.success(`TRL Level updated to ${manualTrl} successfully`);
      }
      setIsEditingTrl(false);

    } catch (error: any) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update. Please try again.';
      toast.error(errorMessage);

      // Final attempt to sync state from server if everything fails
      refetchCase();
    } finally {
      setIsUpdatingTrl(false);
    }
  };

  // Toggle TRL level collapse
  const toggleLevelCollapse = (levelIndex: number) => {
    setCollapsedLevels(prev => ({
      ...prev,
      [levelIndex]: !prev[levelIndex]
    }));
  };

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

    const unselectedCriteria: Array<{ level: number, question: string, id: string }> = [];

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

  const handleSaveSuggestion = (text: string) => {
    setSuggestions(prev => ({ ...prev, "all": text }));

    const assessmentId = assessmentData?.id;

    if (assessmentId) {
      updateSuggestionMutation.mutate({
        assessmentId: assessmentId,
        suggestionData: { improvement_suggestion: text }
      }, {
        onSuccess: () => {
          setIsEditing(false);
        }
      });
    } else {
      console.error("Assessment ID missing in data:", assessmentData);
      toast.error("Error: Cannot find Assessment ID to save.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToCaseDetail}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Case Detail
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Assessment Result
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                Case ID: {caseData?.id || 'Loading...'}
              </Badge>
              <Button
                onClick={handleApproveAssessment}
                disabled={!caseData?.id || updateAssessmentMutation.isPending || caseData?.status === true}
                className={`flex items-center gap-2 ${
                  caseData?.status === true 
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {updateAssessmentMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  caseData?.status === true ? <Check className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
                )}
                
                {caseData?.status === true 
                  ? "Approved" 
                  : (updateAssessmentMutation.isPending ? "Approving..." : "Approve Assessment")
                }              
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
                    {caseData.title}
                  </CardTitle>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline">{caseData.type}</Badge>
                    <Badge variant={caseData.is_urgent ? "destructive" : "secondary"}>
                      {caseData.is_urgent ? "Urgent" : "Not Urgent"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Case ID: {caseData.id}</p>
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
                  <p className="text-sm leading-relaxed">{caseData.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Keywords</h3>
                  <p className="text-sm text-muted-foreground">{caseData.keywords}</p>
                </div>

                {isResearcherPending ? (
                  <div className="space-y-2 py-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ) : isResearcherError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <h3 className="font-semibold">Failed to load researcher</h3>
                    <p className="text-sm">Please try refreshing the page or contact support.</p>
                  </div>
                ) : researcherData ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Researcher</h3>
                      <p className="text-sm text-muted-foreground">{researcherData.first_name} {researcherData.last_name}</p>
                      <p className="text-sm text-muted-foreground">{researcherData.email}</p>
                      <p className="text-sm text-muted-foreground">{researcherData.phone_number}</p>
                    </div>
                  </div>
                ) : null}

                {isCoordinatorPending ? (
                  <div className="space-y-2 py-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ) : isCoordinatorError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <h3 className="font-semibold">Failed to load coordinator</h3>
                    <p className="text-sm">Unable to retrieve coordinator information for this case.</p>
                  </div>
                ) : coordinatorData ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Coordinator</h3>
                      <p className="text-sm text-muted-foreground">{coordinatorData.first_name} {coordinatorData.last_name}</p>
                      <p className="text-sm text-muted-foreground">{coordinatorData.email}</p>
                      <p className="text-sm text-muted-foreground">{coordinatorData.phone_number}</p>
                    </div>
                  </div>
                ) : null}

                {isAssessmentPending ? (
                  <div className="space-y-2 py-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ) : assessmentData && caseData ? (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Estimated TRL Level</h3>
                      <Badge variant="outline" className="text-lg px-3 py-1 border-primary">
                        Level {assessmentData.trl_estimate}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Final TRL Level</h3>
                      {isEditingTrl ? (
                        <div className="flex items-center gap-2">
                          <select
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={manualTrl}
                            onChange={(e) => setManualTrl(Number(e.target.value))}
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                              <option key={level} value={level}>
                                Level {level}
                              </option>
                            ))}
                          </select>

                          <Button
                            size="icon"
                            className="h-8 w-8 bg-green-600 hover:bg-green-700"
                            onClick={handleSaveTrlLevel}
                            disabled={isUpdatingTrl}
                          >
                            {isUpdatingTrl ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => setIsEditingTrl(false)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-lg px-3 py-1 border-primary">
                            Level {caseData.trl_score ?? assessmentData.trl_estimate}
                          </Badge>
                          {caseData.status !== true && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => handleEditTrlClick(
                                Number(caseData.trl_score ?? assessmentData.trl_estimate)
                              )}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}


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
                        className={`flex items-center justify-center py-1 w-10 ${getRQAnswer(index)
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
            const isCollapsed = collapsedLevels[index];

            return (
              <Card key={index} className="w-full">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleLevelCollapse(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-primary">
                      TRL Level {index + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {cqAnswers && cqAnswers.length > 0 && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                          {cqAnswers.length} selected
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLevelCollapse(index);
                        }}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {!isCollapsed && (
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
                )}
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
          </CardHeader>

          <CardContent>
            {isAssessmentPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Loading suggestions...</span>
              </div>
            ) : getUnselectedCriteria().length > 0 ? (
              <div className="space-y-4">
                {/* Editable Area */}
                {isEditing ? (
                  <Textarea
                    value={suggestions["all"] || ''}
                    onChange={(e) => setSuggestions(prev => ({ ...prev, "all": e.target.value }))}
                    className="min-h-[200px] bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm leading-relaxed text-yellow-800 font-medium"
                    placeholder="Enter improvement suggestions here..."
                  />
                ) : (
                  <div
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm leading-relaxed text-yellow-800 whitespace-pre-line"
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
          <CardFooter>
            <div className="flex justify-end">
              {caseData?.status !== true && (
                <>
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/80 mr-2"
                        disabled={updateSuggestionMutation.isPending}
                        onClick={() => {
                          handleSaveSuggestion(suggestions["all"] || '');
                        }}
                      >
                        {updateSuggestionMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            Save
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" disabled={updateSuggestionMutation.isPending} onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Fill textarea with either saved suggestion or bullet points
                        if (!suggestions["all"]) {
                          const defaultText = getUnselectedCriteria()
                            .map((criteria) => `• TRL ${criteria.level}: ${criteria.question}`)
                            .join("\n");
                          setSuggestions(prev => ({ ...prev, "all": defaultText }));
                        }
                        setIsEditing(true);
                      }}
                      className="text-primary border-primary hover:bg-primary/10"
                    >
                      Edit Suggestions
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentResult;

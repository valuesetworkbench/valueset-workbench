var cts2_Module_Factory = function () {
  var cts2 = {
    name: 'cts2',
    defaultElementNamespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/Core',
    typeInfos: [{
        localName: 'PredicateReference',
        baseTypeInfo: '.URIAndEntityName'
      }, {
        localName: 'AssociatedEntitiesReference',
        propertyInfos: [{
            name: 'referencedEntity',
            elementName: {
              localPart: 'referencedEntity',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.URIAndEntityName'
          }, {
            name: 'codeSystem',
            elementName: {
              localPart: 'codeSystem',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CodeSystemReference'
          }, {
            name: 'codeSystemVersion',
            elementName: {
              localPart: 'codeSystemVersion',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CodeSystemVersionReference'
          }, {
            name: 'predicate',
            elementName: {
              localPart: 'predicate',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.PredicateReference'
          }, {
            name: 'direction',
            attributeName: {
              localPart: 'direction'
            },
            type: 'attribute'
          }, {
            name: 'leafOnly',
            attributeName: {
              localPart: 'leafOnly'
            },
            type: 'attribute'
          }, {
            name: 'transitivity',
            attributeName: {
              localPart: 'transitivity'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'SourceAndRoleReference',
        propertyInfos: [{
            name: 'content',
            collection: true,
            allowDom: false,
            allowTypedObject: false,
            elementTypeInfos: [{
                elementName: 'role',
                typeInfo: '.RoleReference'
              }, {
                elementName: 'source',
                typeInfo: '.SourceReference'
              }, {
                elementName: 'bibliographicLink',
                typeInfo: '.OpaqueData'
              }],
            type: 'elementRefs'
          }]
      }, {
        localName: 'Example',
        baseTypeInfo: '.Note'
      }, {
        localName: 'AssociationReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'ResolvedValueSetDirectory',
        baseTypeInfo: '.Directory',
        propertyInfos: [{
            name: 'entry',
            collection: true,
            elementName: {
              localPart: 'entry',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ResolvedValueSetDirectoryEntry'
          }]
      }, {
        localName: 'SourceAndNotation',
        propertyInfos: [{
            name: 'sourceAndNotationDescription'
          }, {
            name: 'sourceDocument'
          }, {
            name: 'sourceLanguage',
            typeInfo: '.OntologyLanguageReference'
          }, {
            name: 'sourceDocumentSyntax',
            typeInfo: '.OntologySyntaxReference'
          }]
      }, {
        localName: 'CompleteValueSetReference',
        propertyInfos: [{
            name: 'valueSet',
            elementName: {
              localPart: 'valueSet',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetReference'
          }, {
            name: 'valueSetDefinition',
            elementName: {
              localPart: 'valueSetDefinition',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetReference'
          }, {
            name: 'referenceCodeSystemVersion',
            elementName: {
              localPart: 'referenceCodeSystemVersion',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CodeSystemVersionReference'
          }]
      }, {
        localName: 'ResolvedValueSet',
        propertyInfos: [{
            name: 'resolutionInfo',
            elementName: {
              localPart: 'resolutionInfo',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ResolvedValueSetHeader'
          }, {
            name: 'entry',
            collection: true,
            elementName: {
              localPart: 'entry',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.URIAndEntityName'
          }]
      }, {
        localName: 'AnonymousStatement',
        propertyInfos: [{
            name: 'predicate',
            typeInfo: '.PredicateReference'
          }, {
            name: 'target',
            collection: true,
            typeInfo: '.StatementTarget'
          }, {
            name: 'statmentQualifier',
            collection: true,
            typeInfo: '.Property'
          }]
      }, {
        localName: 'CodeSystemCategoryReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'Property',
        propertyInfos: [{
            name: 'predicate',
            typeInfo: '.PredicateReference'
          }, {
            name: 'value',
            collection: true,
            typeInfo: '.StatementTarget'
          }, {
            name: 'propertyQualifier',
            collection: true,
            typeInfo: '.Property'
          }, {
            name: 'correspondingStatement',
            attributeName: {
              localPart: 'correspondingStatement'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'LanguageReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'ValueSetDefinition',
        baseTypeInfo: '.ResourceVersionDescription',
        propertyInfos: [{
            name: 'definedValueSet',
            elementName: {
              localPart: 'definedValueSet',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetReference'
          }, {
            name: 'versionTag',
            collection: true,
            elementName: {
              localPart: 'versionTag',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.VersionTagReference'
          }, {
            name: 'entry',
            collection: true,
            elementName: {
              localPart: 'entry',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetDefinitionEntry'
          }]
      }, {
        localName: 'MapReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'ValueSetDefinitionDirectory',
        baseTypeInfo: '.Directory',
        propertyInfos: [{
            name: 'entry',
            collection: true,
            elementName: {
              localPart: 'entry',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetDefinitionDirectoryEntry'
          }]
      }, {
        localName: 'CodeSystemVersionReference',
        propertyInfos: [{
            name: 'version',
            typeInfo: '.NameAndMeaningReference'
          }, {
            name: 'codeSystem',
            typeInfo: '.CodeSystemReference'
          }]
      }, {
        localName: 'ValueSetDefinitionList',
        baseTypeInfo: '.Directory',
        propertyInfos: [{
            name: 'entry',
            collection: true,
            elementName: {
              localPart: 'entry',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetDefinitionListEntry'
          }]
      }, {
        localName: 'NameAndMeaningReference',
        propertyInfos: [{
            name: 'value',
            type: 'value'
          }, {
            name: 'uri',
            attributeName: {
              localPart: 'uri'
            },
            type: 'attribute'
          }, {
            name: 'href',
            attributeName: {
              localPart: 'href'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'StatementTarget',
        propertyInfos: [{
            name: 'entity',
            typeInfo: '.URIAndEntityName'
          }, {
            name: 'literal',
            typeInfo: '.OpaqueData'
          }, {
            name: 'resource'
          }, {
            name: 'bnode',
            collection: true,
            typeInfo: '.AnonymousStatement'
          }, {
            name: 'externalIdentifier',
            attributeName: {
              localPart: 'externalIdentifier'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ResourceVersionDescriptionDirectoryEntry',
        baseTypeInfo: '.ResourceDescriptionDirectoryEntry',
        propertyInfos: [{
            name: 'officialResourceVersionId'
          }, {
            name: 'officialReleaseDate',
            typeInfo: 'Calendar'
          }, {
            name: 'documentURI',
            attributeName: {
              localPart: 'documentURI'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'NamespaceReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'BindingQualifierReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'AbstractResourceDescriptionDirectoryEntry',
        baseTypeInfo: '.ResourceDescriptionDirectoryEntry'
      }, {
        localName: 'ModelAttributeReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'AbstractResourceDescription',
        baseTypeInfo: '.ResourceDescription',
        propertyInfos: [{
            name: 'releaseDocumentation',
            typeInfo: '.OpaqueData'
          }, {
            name: 'releaseFormat',
            collection: true,
            typeInfo: '.SourceAndNotation'
          }]
      }, {
        localName: 'OntologyTaskReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'OntologyEngineeringMethodologyReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'CaseSignificanceReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'NamedEntityReference',
        baseTypeInfo: '.EntityReference'
      }, {
        localName: 'DescriptionInCodeSystem',
        propertyInfos: [{
            name: 'describingCodeSystemVersion',
            typeInfo: '.CodeSystemVersionReference'
          }, {
            name: 'designation'
          }, {
            name: 'href',
            attributeName: {
              localPart: 'href'
            },
            type: 'attribute'
          }, {
            name: 'codeSystemRole',
            attributeName: {
              localPart: 'codeSystemRole'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'TsAnyType',
        propertyInfos: [{
            name: 'content',
            collection: true,
            type: 'anyElement'
          }]
      }, {
        localName: 'ResourceVersionDescription',
        baseTypeInfo: '.ResourceDescription',
        propertyInfos: [{
            name: 'sourceAndNotation',
            typeInfo: '.SourceAndNotation'
          }, {
            name: 'predecessor',
            typeInfo: '.NameAndMeaningReference'
          }, {
            name: 'officialResourceVersionId'
          }, {
            name: 'officialReleaseDate',
            typeInfo: 'Calendar'
          }, {
            name: 'officialActivationDate',
            typeInfo: 'Calendar'
          }, {
            name: 'documentURI',
            attributeName: {
              localPart: 'documentURI'
            },
            type: 'attribute'
          }, {
            name: 'state',
            attributeName: {
              localPart: 'state'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ResolvedValueSetHeader',
        propertyInfos: [{
            name: 'resolutionOf',
            elementName: {
              localPart: 'resolutionOf',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetDefinitionReference'
          }, {
            name: 'resolvedUsingCodeSystem',
            collection: true,
            elementName: {
              localPart: 'resolvedUsingCodeSystem',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CodeSystemVersionReference'
          }, {
            name: 'includesResolvedValueSet',
            collection: true,
            elementName: {
              localPart: 'includesResolvedValueSet',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ResolvedValueSetHeader'
          }]
      }, {
        localName: 'CodeSystemReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'FormatReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'Directory',
        baseTypeInfo: '.Message',
        propertyInfos: [{
            name: 'directoryFilter',
            typeInfo: '.Filter'
          }, {
            name: 'sortCriteria',
            typeInfo: '.SortCriteria'
          }, {
            name: 'complete',
            attributeName: {
              localPart: 'complete'
            },
            type: 'attribute'
          }, {
            name: 'numEntries',
            typeInfo: 'Integer',
            attributeName: {
              localPart: 'numEntries'
            },
            type: 'attribute'
          }, {
            name: 'prev',
            attributeName: {
              localPart: 'prev'
            },
            type: 'attribute'
          }, {
            name: 'next',
            attributeName: {
              localPart: 'next'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Parameter',
        propertyInfos: [{
            name: 'val'
          }, {
            name: 'arg',
            attributeName: {
              localPart: 'arg'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ResolvedValueSetSummary',
        propertyInfos: [{
            name: 'resolvedHeader',
            elementName: {
              localPart: 'resolvedHeader',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ResolvedValueSetHeader'
          }, {
            name: 'resolvedValueSetURI',
            attributeName: {
              localPart: 'resolvedValueSetURI'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'URIAndEntityName',
        propertyInfos: [{
            name: 'namespace'
          }, {
            name: 'name'
          }, {
            name: 'designation'
          }, {
            name: 'uri',
            attributeName: {
              localPart: 'uri'
            },
            type: 'attribute'
          }, {
            name: 'href',
            attributeName: {
              localPart: 'href'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Definition',
        baseTypeInfo: '.Note',
        propertyInfos: [{
            name: 'usageContext',
            typeInfo: '.ContextReference'
          }, {
            name: 'definitionRole',
            attributeName: {
              localPart: 'definitionRole'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'OntologyEngineeringToolReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'OpaqueData',
        propertyInfos: [{
            name: 'value',
            typeInfo: '.TsAnyType'
          }, {
            name: 'format',
            typeInfo: '.FormatReference'
          }, {
            name: 'language',
            typeInfo: '.LanguageReference'
          }, {
            name: 'schema'
          }]
      }, {
        localName: 'Message',
        propertyInfos: [{
            name: 'heading',
            typeInfo: '.RESTResource'
          }]
      }, {
        localName: 'AnonymousEntityReference',
        baseTypeInfo: '.EntityReference'
      }, {
        localName: 'ComponentReference',
        propertyInfos: [{
            name: 'attributeReference'
          }, {
            name: 'propertyReference',
            typeInfo: '.URIAndEntityName'
          }, {
            name: 'specialReference'
          }]
      }, {
        localName: 'ContextReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'ComponentReferenceList',
        propertyInfos: [{
            name: 'entry',
            collection: true,
            typeInfo: '.ComponentReference'
          }]
      }, {
        localName: 'MapVersionReference',
        propertyInfos: [{
            name: 'mapVersion',
            typeInfo: '.NameAndMeaningReference'
          }, {
            name: 'map',
            typeInfo: '.MapReference'
          }]
      }, {
        localName: 'OntologyDomainReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'EntityReferenceList',
        propertyInfos: [{
            name: 'entry',
            collection: true,
            typeInfo: '.EntityReference'
          }]
      }, {
        localName: 'CompleteCodeSystemReference',
        propertyInfos: [{
            name: 'codeSystem',
            elementName: {
              localPart: 'codeSystem',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CodeSystemReference'
          }, {
            name: 'codeSystemVersion',
            elementName: {
              localPart: 'codeSystemVersion',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CodeSystemVersionReference'
          }]
      }, {
        localName: 'ResolvedValueSetDirectoryEntry',
        baseTypeInfo: '.ResolvedValueSetSummary',
        propertyInfos: [{
            name: 'href',
            attributeName: {
              localPart: 'href'
            },
            type: 'attribute'
          }, {
            name: 'resourceName',
            attributeName: {
              localPart: 'resourceName'
            },
            type: 'attribute'
          }, {
            name: 'matchStrength',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'matchStrength'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'IteratableResolvedValueSet',
        baseTypeInfo: '.Directory',
        propertyInfos: [{
            name: 'resolutionInfo',
            elementName: {
              localPart: 'resolutionInfo',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ResolvedValueSetHeader'
          }, {
            name: 'entry',
            collection: true,
            elementName: {
              localPart: 'entry',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.URIAndEntityName'
          }]
      }, {
        localName: 'SourceReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'DesignationTypeReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'ResourceDescription',
        baseTypeInfo: '.Changeable',
        propertyInfos: [{
            name: 'keyword',
            collection: true
          }, {
            name: 'resourceType',
            collection: true,
            typeInfo: '.URIAndEntityName'
          }, {
            name: 'resourceSynopsis',
            typeInfo: '.EntryDescription'
          }, {
            name: 'additionalDocumentation',
            collection: true
          }, {
            name: 'sourceAndRole',
            collection: true,
            typeInfo: '.SourceAndRoleReference'
          }, {
            name: 'rights',
            typeInfo: '.OpaqueData'
          }, {
            name: 'note',
            collection: true,
            typeInfo: '.Comment'
          }, {
            name: 'property',
            collection: true,
            typeInfo: '.Property'
          }, {
            name: 'alternateID',
            collection: true
          }, {
            name: 'sourceStatements'
          }, {
            name: 'about',
            attributeName: {
              localPart: 'about'
            },
            type: 'attribute'
          }, {
            name: 'formalName',
            attributeName: {
              localPart: 'formalName'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'PropertyQueryReference',
        propertyInfos: [{
            name: 'codeSystem',
            elementName: {
              localPart: 'codeSystem',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CodeSystemReference'
          }, {
            name: 'codeSystemVersion',
            elementName: {
              localPart: 'codeSystemVersion',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CodeSystemVersionReference'
          }, {
            name: 'filter',
            elementName: {
              localPart: 'filter',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.FilterComponent'
          }]
      }, {
        localName: 'ChangeSetBase',
        baseTypeInfo: '.Finalizable',
        propertyInfos: [{
            name: 'creator',
            typeInfo: '.SourceReference'
          }, {
            name: 'changeInstructions',
            typeInfo: '.OpaqueData'
          }, {
            name: 'member',
            collection: true,
            typeInfo: 'AnyType'
          }, {
            name: 'changeSetURI',
            attributeName: {
              localPart: 'changeSetURI'
            },
            type: 'attribute'
          }, {
            name: 'creationDate',
            typeInfo: 'Calendar',
            attributeName: {
              localPart: 'creationDate'
            },
            type: 'attribute'
          }, {
            name: 'officialEffectiveDate',
            typeInfo: 'Calendar',
            attributeName: {
              localPart: 'officialEffectiveDate'
            },
            type: 'attribute'
          }, {
            name: 'closeDate',
            typeInfo: 'Calendar',
            attributeName: {
              localPart: 'closeDate'
            },
            type: 'attribute'
          }, {
            name: 'entryCount',
            typeInfo: 'Integer',
            attributeName: {
              localPart: 'entryCount'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'DirectoryEntry',
        propertyInfos: [{
            name: 'href',
            attributeName: {
              localPart: 'href'
            },
            type: 'attribute'
          }, {
            name: 'resourceName',
            attributeName: {
              localPart: 'resourceName'
            },
            type: 'attribute'
          }, {
            name: 'matchStrength',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'matchStrength'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ValueSetDefinitionListEntry',
        baseTypeInfo: '.DirectoryEntry',
        propertyInfos: [{
            name: 'entry',
            collection: true,
            elementName: {
              localPart: 'entry',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetDefinition'
          }]
      }, {
        localName: 'OntologyTypeReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'EntryDescription',
        baseTypeInfo: '.OpaqueData'
      }, {
        localName: 'EntityExpression',
        propertyInfos: [{
            name: 'ontologyLanguageAndSyntax',
            typeInfo: '.OntologyLanguageAndSyntax'
          }, {
            name: 'expression',
            typeInfo: '.OpaqueData'
          }]
      }, {
        localName: 'Note',
        baseTypeInfo: '.EntryDescription',
        propertyInfos: [{
            name: 'assertedInCodeSystemVersion',
            attributeName: {
              localPart: 'assertedInCodeSystemVersion'
            },
            type: 'attribute'
          }, {
            name: 'correspondingStatement',
            attributeName: {
              localPart: 'correspondingStatement'
            },
            type: 'attribute'
          }, {
            name: 'externalIdentifier',
            attributeName: {
              localPart: 'externalIdentifier'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'OntologySyntaxReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'OntologyLanguageReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'StatusReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'ValueSetDefinitionMsg',
        baseTypeInfo: '.Message',
        propertyInfos: [{
            name: 'valueSetDefinition',
            elementName: {
              localPart: 'valueSetDefinition',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetDefinition'
          }]
      }, {
        localName: 'ResourceDescriptionDirectoryEntry',
        baseTypeInfo: '.DirectoryEntry',
        propertyInfos: [{
            name: 'resourceSynopsis',
            typeInfo: '.EntryDescription'
          }, {
            name: 'about',
            attributeName: {
              localPart: 'about'
            },
            type: 'attribute'
          }, {
            name: 'formalName',
            attributeName: {
              localPart: 'formalName'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Changeable',
        propertyInfos: [{
            name: 'status',
            typeInfo: '.StatusReference'
          }, {
            name: 'changeDescription',
            typeInfo: '.ChangeDescription'
          }, {
            name: 'entryState',
            attributeName: {
              localPart: 'entryState'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ExternalValueSetDefinition',
        baseTypeInfo: '.OpaqueData'
      }, {
        localName: 'ValueSetDefinitionEntry',
        propertyInfos: [{
            name: 'associatedEntities',
            elementName: {
              localPart: 'associatedEntities',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.AssociatedEntitiesReference'
          }, {
            name: 'completeCodeSystem',
            elementName: {
              localPart: 'completeCodeSystem',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CompleteCodeSystemReference'
          }, {
            name: 'completeValueSet',
            elementName: {
              localPart: 'completeValueSet',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.CompleteValueSetReference'
          }, {
            name: 'externalValueSetDefinition',
            elementName: {
              localPart: 'externalValueSetDefinition',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ExternalValueSetDefinition'
          }, {
            name: 'propertyQuery',
            elementName: {
              localPart: 'propertyQuery',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.PropertyQueryReference'
          }, {
            name: 'entityList',
            elementName: {
              localPart: 'entityList',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.SpecificEntityList'
          }, {
            name: 'operator',
            attributeName: {
              localPart: 'operator'
            },
            type: 'attribute'
          }, {
            name: 'entryOrder',
            typeInfo: 'Integer',
            attributeName: {
              localPart: 'entryOrder'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ValueSetDefinitionReference',
        propertyInfos: [{
            name: 'valueSetDefinition',
            typeInfo: '.NameAndMeaningReference'
          }, {
            name: 'valueSet',
            typeInfo: '.ValueSetReference'
          }]
      }, {
        localName: 'ChangeDescription',
        propertyInfos: [{
            name: 'prevImage',
            typeInfo: '.Changeable'
          }, {
            name: 'changeNotes',
            typeInfo: '.OpaqueData'
          }, {
            name: 'changeSource',
            typeInfo: '.SourceReference'
          }, {
            name: 'clonedResource',
            typeInfo: '.NameAndMeaningReference'
          }, {
            name: 'changeType',
            attributeName: {
              localPart: 'changeType'
            },
            type: 'attribute'
          }, {
            name: 'committed',
            attributeName: {
              localPart: 'committed'
            },
            type: 'attribute'
          }, {
            name: 'containingChangeSet',
            attributeName: {
              localPart: 'containingChangeSet'
            },
            type: 'attribute'
          }, {
            name: 'prevChangeSet',
            attributeName: {
              localPart: 'prevChangeSet'
            },
            type: 'attribute'
          }, {
            name: 'changeDate',
            typeInfo: 'Calendar',
            attributeName: {
              localPart: 'changeDate'
            },
            type: 'attribute'
          }, {
            name: 'effectiveDate',
            typeInfo: 'Calendar',
            attributeName: {
              localPart: 'effectiveDate'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'SortCriterion',
        propertyInfos: [{
            name: 'sortElement',
            typeInfo: '.ComponentReference'
          }, {
            name: 'sortDirection',
            attributeName: {
              localPart: 'sortDirection'
            },
            type: 'attribute'
          }, {
            name: 'entryOrder',
            typeInfo: 'Integer',
            attributeName: {
              localPart: 'entryOrder'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ValueSetDefinitionDirectoryEntry',
        baseTypeInfo: '.ResourceVersionDescriptionDirectoryEntry',
        propertyInfos: [{
            name: 'definedValueSet',
            elementName: {
              localPart: 'definedValueSet',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ValueSetReference'
          }, {
            name: 'versionTag',
            collection: true,
            elementName: {
              localPart: 'versionTag',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.VersionTagReference'
          }]
      }, {
        localName: 'SpecificEntityList',
        propertyInfos: [{
            name: 'referencedEntity',
            collection: true,
            elementName: {
              localPart: 'referencedEntity',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.URIAndEntityName'
          }]
      }, {
        localName: 'OntologyLanguageAndSyntax',
        propertyInfos: [{
            name: 'ontologyLanguage',
            typeInfo: '.OntologyLanguageReference'
          }, {
            name: 'ontologySyntax',
            typeInfo: '.OntologySyntaxReference'
          }]
      }, {
        localName: 'ValueSetReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'MatchAlgorithmReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'VersionTagReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'RoleReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'MapCorrelationReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'Comment',
        baseTypeInfo: '.Note',
        propertyInfos: [{
            name: 'type',
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ResolvedValueSetMsg',
        baseTypeInfo: '.Message',
        propertyInfos: [{
            name: 'resolvedValueSet',
            elementName: {
              localPart: 'resolvedValueSet',
              namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
            },
            typeInfo: '.ResolvedValueSet'
          }]
      }, {
        localName: 'EntityReference',
        propertyInfos: [{
            name: 'name',
            typeInfo: '.ScopedEntityName'
          }, {
            name: 'knownEntityDescription',
            collection: true,
            typeInfo: '.DescriptionInCodeSystem'
          }, {
            name: 'about',
            attributeName: {
              localPart: 'about'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'FilterComponent',
        baseTypeInfo: '.ComponentReference',
        propertyInfos: [{
            name: 'matchAlgorithm',
            typeInfo: '.MatchAlgorithmReference'
          }, {
            name: 'matchValue'
          }]
      }, {
        localName: 'Finalizable',
        propertyInfos: [{
            name: 'state',
            attributeName: {
              localPart: 'state'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'RESTResource',
        propertyInfos: [{
            name: 'resourceRoot'
          }, {
            name: 'resourceURI'
          }, {
            name: 'parameter',
            collection: true,
            typeInfo: '.Parameter'
          }, {
            name: 'accessDate',
            typeInfo: 'Calendar'
          }]
      }, {
        localName: 'Filter',
        propertyInfos: [{
            name: 'component',
            collection: true,
            typeInfo: '.FilterComponent'
          }]
      }, {
        localName: 'SortCriteria',
        propertyInfos: [{
            name: 'entry',
            collection: true,
            typeInfo: '.SortCriterion'
          }]
      }, {
        localName: 'ConceptDomainReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'ReasoningAlgorithmReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'FormalityLevelReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'DesignationFidelityReference',
        baseTypeInfo: '.NameAndMeaningReference'
      }, {
        localName: 'ScopedEntityName',
        propertyInfos: [{
            name: 'namespace'
          }, {
            name: 'name'
          }]
      }, {
        type: 'enumInfo',
        localName: 'SetOperator',
        values: ['UNION', 'INTERSECT', 'SUBTRACT']
      }, {
        type: 'enumInfo',
        localName: 'ChangeType',
        values: ['CREATE', 'UPDATE', 'METADATA', 'DELETE', 'CLONE', 'IMPORT']
      }, {
        type: 'enumInfo',
        localName: 'ChangeCommitted',
        values: ['PENDING', 'COMMITTED']
      }, {
        type: 'enumInfo',
        localName: 'AssociationDirection',
        values: ['SOURCE_TO_TARGET', 'TARGET_TO_SOURCE']
      }, {
        type: 'enumInfo',
        localName: 'SortDirection',
        values: ['ASCENDING', 'DESCENDING']
      }, {
        type: 'enumInfo',
        localName: 'FinalizableState',
        values: ['OPEN', 'FINAL']
      }, {
        type: 'enumInfo',
        localName: 'NoteType',
        values: ['ChangeNote', 'EditorialNote', 'HistoryNote', 'ScopeNote', 'Note']
      }, {
        type: 'enumInfo',
        localName: 'CodeSystemRole',
        values: ['PRIMARY', 'SECONDARY']
      }, {
        type: 'enumInfo',
        localName: 'LeafOrAll',
        values: ['LEAF_ONLY', 'ALL_INTERMEDIATE_NODES']
      }, {
        type: 'enumInfo',
        localName: 'DefinitionRole',
        values: ['NORMATIVE', 'INFORMATIVE']
      }, {
        type: 'enumInfo',
        localName: 'EntryState',
        values: ['INACTIVE', 'ACTIVE']
      }, {
        type: 'enumInfo',
        localName: 'SetOperator',
        values: ['UNION', 'INTERSECT', 'SUBTRACT']
      }, {
        type: 'enumInfo',
        localName: 'CompleteDirectory',
        values: ['COMPLETE', 'PARTIAL']
      }, {
        type: 'enumInfo',
        localName: 'TransitiveClosure',
        values: ['DIRECTLY_ASSOCIATED', 'TRANSITIVE_CLOSURE']
      }, {
        type: 'enumInfo',
        localName: 'CTS2ResourceType',
        values: ['CODE_SYSTEM', 'CODE_SYSTEM_VERSION', 'CONCEPT_DOMAIN', 'MAP', 'MAP_VERSION', 'VALUE_SET', 'VALUE_SET_DEFINITION']
      }],
    elementInfos: [{
        elementName: 'EntityExpression',
        typeInfo: '.EntityExpression'
      }, {
        elementName: {
          localPart: 'ResolvedValueSet',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ResolvedValueSet'
      }, {
        elementName: {
          localPart: 'IteratableResolvedValueSet',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.IteratableResolvedValueSet'
      }, {
        elementName: 'bibliographicLink',
        typeInfo: '.OpaqueData',
        scope: '.SourceAndRoleReference'
      }, {
        elementName: {
          localPart: 'ValueSetDefinitionEntry',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ValueSetDefinitionEntry'
      }, {
        elementName: {
          localPart: 'ValueSetDefinitionDirectory',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ValueSetDefinitionDirectory'
      }, {
        elementName: {
          localPart: 'ValueSetDefinitionList',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ValueSetDefinitionList'
      }, {
        elementName: {
          localPart: 'ResolvedValueSetMsg',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ResolvedValueSetMsg'
      }, {
        elementName: {
          localPart: 'ValueSetDefinitionMsg',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ValueSetDefinitionMsg'
      }, {
        elementName: {
          localPart: 'ValueSetDefinition',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ValueSetDefinition'
      }, {
        elementName: {
          localPart: 'ResolvedValueSetDirectory',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ResolvedValueSetDirectory'
      }, {
        elementName: 'role',
        typeInfo: '.RoleReference',
        scope: '.SourceAndRoleReference'
      }, {
        elementName: 'source',
        typeInfo: '.SourceReference',
        scope: '.SourceAndRoleReference'
      }, {
        elementName: {
          localPart: 'ResolvedValueSetSummary',
          namespaceURI: 'http:\/\/www.omg.org\/spec\/CTS2\/1.1\/ValueSetDefinition'
        },
        typeInfo: '.ResolvedValueSetSummary'
      }]
  };
  return {
    cts2: cts2
  };
};
if (typeof define === 'function' && define.amd) {
  define([], cts2_Module_Factory);
}
else {
  var cts2_Module = cts2_Module_Factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.cts2 = cts2_Module.cts2;
  }
  else {
    var cts2 = cts2_Module.cts2;
  }
}